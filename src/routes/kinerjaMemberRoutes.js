const express = require("express");
const router = express.Router();
const kinerjaController = require("../controllers/kinerjaMemberController");

router.get("/", kinerjaController.getAllKinerja);
router.get("/:id", kinerjaController.getKinerjaById);
router.post("/", kinerjaController.createKinerja);
router.put("/:id", kinerjaController.updateKinerja);
router.delete("/:id", kinerjaController.deleteKinerja);

module.exports = router;