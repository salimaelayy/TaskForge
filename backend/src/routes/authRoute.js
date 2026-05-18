const express = require("express");
const { register, login, logout, profile } = require("../controllers/authController");
const { registerRules, loginRules } = require("../validators/authValidator");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post("/register", registerRules, validateRequest,register);
router.post("/login",loginRules, validateRequest, login);
router.post("/logout", logout);
router.get("/profile", protect, profile);

module.exports = router;