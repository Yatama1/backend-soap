const express = require("express");
const router = express.Router();
const rumahController = require("../controllers/rumahController");

// Routes CRUD Member
router.get("/", rumahController.getAllRumah);
router.get("/:id", rumahController.getRumahById);
router.post("/", rumahController.createRumah);
router.put("/:id", rumahController.updateRumah);
router.delete("/:id", rumahController.deleteRumah);

module.exports = router;