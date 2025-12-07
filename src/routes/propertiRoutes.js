const express = require("express");
const router = express.Router();
const propertiController = require("../controllers/propertiController");

// Routes CRUD Properti
router.get("/", propertiController.getAllProperti);
router.get("/:id", propertiController.getPropertiById);
router.post("/", propertiController.createProperti);
router.put("/:id", propertiController.updateProperti);
router.delete("/:id", propertiController.deleteProperti);

module.exports = router;