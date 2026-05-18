const { body } = require("express-validator");

const updateProfileRules = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Valid email is required"),
];

const changePasswordRules = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .withMessage("Password must be at least 8 characters and include uppercase, lowercase, and a number"),
];

module.exports = { updateProfileRules, changePasswordRules };
