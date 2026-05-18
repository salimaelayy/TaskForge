const { body } = require("express-validator");

const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .withMessage("Password must be at least 8 characters and include uppercase, lowercase, and a number"),
];

const loginRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = { registerRules, loginRules };
