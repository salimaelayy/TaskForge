const User = require("../models/user");

const userView = (userDoc) => ({
  id: userDoc._id,
  name: userDoc.name,
  email: userDoc.email,
  createdAt: userDoc.createdAt,
  updatedAt: userDoc.updatedAt,
});

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const createUser = async (req, res) => {
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

    return res.status(201).json({
      success: true,
      message: "User created",
      data: userView(user),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: users.map(userView),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: userView(user),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: userView(req.user),
  });
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      if (normalizedEmail !== user.email) {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: "Email already in use",
          });
        }
      }
      user.email = normalizedEmail;
    }

    if (name) {
      user.name = name.trim();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      data: userView(user),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      if (normalizedEmail !== user.email) {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: "Email already in use",
          });
        }
      }
      user.email = normalizedEmail;
    }

    if (name) {
      user.name = name.trim();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated",
      data: userView(user),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getProfile,
  updateProfile,
  updateUserById,
  deleteUserById,
  changePassword,
};
