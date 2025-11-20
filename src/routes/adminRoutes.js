const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/authMiddleware");
const {
    getAdmins,
    registerAdmin,
    loginAdmin,
    updateAdmin,
    deleteAdmin,
} = require("../controllers/adminController");

router.get("/", auth, getAdmins);
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.put("/:id", auth, updateAdmin);
router.delete("/:id", auth, deleteAdmin);

module.exports = router;
