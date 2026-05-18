const User = require("../models/user");
const generateToken = require("../middleware/generateToken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    if (err && err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(err.errors)[0].message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to login",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

const profile = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};

module.exports = { register, login, logout, profile };
