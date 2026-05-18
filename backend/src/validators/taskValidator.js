const { body, query, param } = require("express-validator");

const allowedStatus = ["todo", "in_progress", "done"];
const allowedPriority = ["low", "medium", "high"];
const allowedSortBy = ["createdAt", "updatedAt", "dueDate", "priority", "status", "title"];

const createTaskRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("status").optional().isIn(allowedStatus).withMessage("Invalid status"),
  body("priority").optional().isIn(allowedPriority).withMessage("Invalid priority"),
  body("dueDate").optional().isISO8601().withMessage("dueDate must be a valid ISO date"),
];

const updateTaskRules = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("status").optional().isIn(allowedStatus).withMessage("Invalid status"),
  body("priority").optional().isIn(allowedPriority).withMessage("Invalid priority"),
  body("dueDate").optional().isISO8601().withMessage("dueDate must be a valid ISO date"),
];

const taskIdRule = [param("id").isMongoId().withMessage("Invalid task id")];

const listTaskRules = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be >= 1"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be 1-100"),
  query("status").optional().isIn(allowedStatus).withMessage("Invalid status"),
  query("priority").optional().isIn(allowedPriority).withMessage("Invalid priority"),
  query("sortBy").optional().isIn(allowedSortBy).withMessage("Invalid sortBy"),
  query("sortOrder").optional().isIn(["asc", "desc"]).withMessage("Invalid sortOrder"),
];

module.exports = { createTaskRules, updateTaskRules, taskIdRule, listTaskRules };