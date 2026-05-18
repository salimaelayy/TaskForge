const mongoose = require("mongoose");
const Task = require("../models/task");

const formatTask = (taskDoc) => ({
  id: taskDoc._id,
  title: taskDoc.title,
  description: taskDoc.description,
  status: taskDoc.status,
  priority: taskDoc.priority,
  dueDate: taskDoc.dueDate,
  completedAt: taskDoc.completedAt,
  owner: taskDoc.owner,
  createdAt: taskDoc.createdAt,
  updatedAt: taskDoc.updatedAt,
});

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      priority,
      dueDate,
      owner: req.user._id,
      completedAt: status === "done" ? new Date() : null,
    });

    return res.status(201).json({
      success: true,
      message: "Task created",
      data: formatTask(task),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const { status, priority, page = "1", limit = "10", sortBy = "createdAt", sortOrder = "desc" } = req.query;
    const filter = { owner: req.user._id };

    const parsedPage = Number.parseInt(page, 10);
    const parsedLimit = Number.parseInt(limit, 10);

    const currentPage = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
    const pageLimit = Number.isNaN(parsedLimit) || parsedLimit < 1 ? 10 : Math.min(parsedLimit, 100);

    const allowedSortFields = ["createdAt", "updatedAt", "dueDate", "priority", "status", "title"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit);

    const totalPages = Math.ceil(total / pageLimit) || 1;

    return res.status(200).json({
      success: true,
      data: tasks.map(formatTask),
      pagination: {
        page: currentPage,
        limit: pageLimit,
        total,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task id",
      });
    }

    const task = await Task.findOne({ _id: id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: formatTask(task),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task id",
      });
    }

    const task = await Task.findOne({ _id: id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const updatableFields = ["title", "description", "status", "priority", "dueDate"];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    task.completedAt = task.status === "done" ? task.completedAt || new Date() : null;

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated",
      data: formatTask(task),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task id",
      });
    }

    const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
