// file: controllers/crmController.js
const Crm = require("../models/Crm");
const Cabuy = require("../models/Cabuy");
const Member = require("../models/Member");

// 🔹 GET semua data CRM (dengan relasi Member & Cabuy)
exports.getAllCrm = async (req, res) => {
    try {
        const data = await Crm.findAll({
            include: [
                { model: Member, attributes: ["id_member", "nama_member", "jabatan", "leader_id", "kontak", "id_admin"] },
                { model: Cabuy, attributes: ["id_cabuy", "nama_cabuy", "kontak", "status", "tanggal_follow_up", "tanggal_masuk", "id_member"] },
            ],
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 GET CRM berdasarkan ID
exports.getCrmById = async (req, res) => {
    try {
        const crm = await Crm.findByPk(req.params.id, {
            include: [Member, Cabuy],
        });
        if (!crm) return res.status(404).json({ message: "Data CRM tidak ditemukan" });
        res.json(crm);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 POST: Tambah data CRM baru
exports.createCrm = async (req, res) => {
    try {
        const { id_cabuy, id_member, interaksi_terakhir, catatan, strategi_followup } = req.body;
        const newCrm = await Crm.create({
            id_cabuy,
            id_member,
            interaksi_terakhir,
            catatan,
            strategi_followup,
        });
        res.status(201).json(newCrm);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 PUT: Update data CRM
exports.updateCrm = async (req, res) => {
    try {
        const { id_cabuy, id_member, interaksi_terakhir, catatan, strategi_followup } = req.body;
        const crm = await Crm.findByPk(req.params.id);
        if (!crm) return res.status(404).json({ message: "Data CRM tidak ditemukan" });

        await crm.update({ id_cabuy, id_member, interaksi_terakhir, catatan, strategi_followup });
        res.json(crm);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 DELETE: Hapus data CRM
exports.deleteCrm = async (req, res) => {
    try {
        const crm = await Crm.findByPk(req.params.id);
        if (!crm) return res.status(404).json({ message: "Data CRM tidak ditemukan" });

        await crm.destroy();
        res.json({ message: "Data CRM berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};