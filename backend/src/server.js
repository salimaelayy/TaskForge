const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const connectDB = require("./config/db.js");

const authRoutes = require("./routes/authRoute.js");
const taskRoutes = require("./routes/taskRoute.js");
const userRoutes = require("./routes/userRoute.js");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ credentials: true, origin: corsOrigin }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("listening on port: " + PORT);
    });
  } catch (err) {
    console.error("Server failed to start:", err.message);
    process.exit(1);
  }
};

startServer();
