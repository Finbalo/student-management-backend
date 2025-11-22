import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database/database.js";
import cors from "cors";
import auth from "./routes/auth.js";

dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    // origin: ["http://localhost:5173"],
    origin: ["https://crudapp-student-m-s.netlify.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
// app.get("/api/health", (req, res) => {
//   res.json({
//     success: true,
//     message: "Server is running",
//     timestamp: new Date().toISOString(),
//   });
// });

app.use("/api", auth);

// Correct 404 handler - use express style
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware (must have 4 parameters)
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    await connectDB();
    console.log("✅ Server started successfully");
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
});
