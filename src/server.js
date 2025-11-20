const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/db");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/members", memberRoutes);  // <- selalu plural utk resources

// Test DB
sequelize.sync()
    .then(() => console.log("✅ Database connected & synced"))
    .catch((err) => console.error("DB Error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("SECRET:", process.env.JWT_SECRET);
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
