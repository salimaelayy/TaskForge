const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI); // or MONGO_URI
    console.log("Connected to the database");
  } catch (err) {
    console.error("Not connected to the database:", err.message);
    throw err;
  }
};

module.exports = connectDB;