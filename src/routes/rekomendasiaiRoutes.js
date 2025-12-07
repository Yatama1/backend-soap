const express = require("express");
const router = express.Router();
const rekomendasiController = require("../controllers/rekomendasiaiController");

// Route CRUD
router.get("/", rekomendasiController.getAllRekomendasi);
router.get("/:id", rekomendasiController.getRekomendasiById);
router.post("/", rekomendasiController.createRekomendasi);
router.put("/:id", rekomendasiController.updateRekomendasi);
router.delete("/:id", rekomendasiController.deleteRekomendasi);

module.exports = router;