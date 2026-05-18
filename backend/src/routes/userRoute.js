const express = require("express");
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { changePasswordRules } = require("../validators/userValidator");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.use(protect);

router.get("/me", getProfile);
router.patch("/me", updateProfile);
router.patch("/me/password", changePasswordRules, validateRequest, changePassword);

module.exports = router;
