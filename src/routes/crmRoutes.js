// file: routes/crmRoutes.js
const express = require("express");
const router = express.Router();
const crmController = require("../controllers/crmController");

// ✅ Routes untuk model CRM
router.get("/", crmController.getAllCrm);
router.get("/:id", crmController.getCrmById);
router.post("/", crmController.createCrm);
router.put("/:id", crmController.updateCrm);
router.delete("/:id", crmController.deleteCrm);

module.exports = router;