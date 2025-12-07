const express = require("express");
const router = express.Router();
const memberDashboardController = require("../controllers/memberDashboardController");

// GET /api/admin/dashboard
router.get("/", memberDashboardController.getMemberDashboardStats);

module.exports = router;