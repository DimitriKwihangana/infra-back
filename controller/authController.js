const User = require("../model/UserModel");
const Jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const updateUserInfo = async (req, res, next) => {
  try {
    const userId = req.params.id; // Extracting user ID from the request parameters

    // Check if req.body is defined and has the expected properties
    if (!req.body) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.phone) updates.phone = req.body.phone;
    if (req.body.location) updates.location = req.body.location;

    // Update user information by ID
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User information updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};


const Register = async (req, res, next) => {
  try {
    // Check if req.body is defined and has the expected properties
    if (
      !req.body ||
      !req.body.name ||
      !req.body.email ||
      !req.body.phone ||
      !req.body.password ||
      !req.body.location ||
      !req.body.role
    ) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const hashedPass = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      location:req.body.location,
      role:req.body.role,
      password: hashedPass,
    });

    await user.save();

    res.json({
      message: "User Added",
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already Exists",
      });
    }
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


const login = (req, res, next) => {
  try {
    let name = req.body.email || req.body.phone;
    let password = req.body.password;

    if (!name || !password) {
      return res.status(400).json({
        message: "Invalid login credentials",
      });
    }

    User.findOne({ $or: [{ email: name }, { phone: name }] })
      .then((user) => {
        if (user) {
          bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
              res.status(500).json({
                error: "Internal server error",
              });
            } else if (result) {
              const userdata = {
                id: user._id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                location:user.location,
                role:user.role
              };

              let token = Jwt.sign(
                { name: user.name, email: user.email, phone: user.phone },
                "verySecretValue",
                { expiresIn: "1h" }
              );

              res.json({
                message: "Login successful",
                token,
                userdata,
              });
            } else {
              res.status(401).json({
                message: "Invalid password",
              });
            }
          });
        } else {
          res.status(404).json({
            message: "User not found",
          });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({
          error: "Internal server error",
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getUserById = async (req,res) => {
  try {
    const userId  = req.params.id;
    const user = await User.findById(userId);
    res.status(200).json({"user": user});
  } catch (error) {
    console.error(error);
    throw new Error("Error finding user by ID");
  }
};


module.exports = {
  Register,
  login,
  updateUserInfo,
  getUserById
};
