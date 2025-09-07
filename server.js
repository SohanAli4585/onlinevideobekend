const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ভিডিও serve করার জন্য

// ---------------------
// MySQL Database
// ---------------------
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) throw err;
    console.log("✅ MySQL connected...");
});

module.exports = db; // Export db for controllers

// ---------------------
// Routes
// ---------------------
const authRoutes = require("./routes/auth");
const videoRoutes = require("./routes/videos");

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

// ---------------------
// Start Server
// ---------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
