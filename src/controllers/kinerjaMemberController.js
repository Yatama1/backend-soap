const KinerjaMember = require("../models/KinerjaMember");
const Member = require("../models/Member");

// 🔹 GET semua data kinerja member
exports.getAllKinerja = async (req, res) => {
    try {
        const data = await KinerjaMember.findAll({
            include: [
                {
                    model: Member,
                    attributes: ["id_member", "nama_member", "kontak", "id_admin", "jabatan", "leader_id", "email"],
                },
            ],
        });

        res.status(200).json({
            message: "Data kinerja member berhasil diambil",
            data,
        });
    } catch (error) {
        console.error("Error getAllKinerja:", error);
        res.status(500).json({ message: "Gagal mengambil data kinerja member" });
    }
};

// 🔹 GET satu data kinerja member berdasarkan id_kinerja
exports.getKinerjaById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await KinerjaMember.findByPk(id, {
            include: [
                {
                    model: Member,
                    attributes: ["id_member", "nama_member", "kontak", "id_admin", "jabatan", "leader_id", "email"],
                },
            ],
        });

        if (!data)
            return res.status(404).json({ message: "Kinerja member tidak ditemukan" });

        res.status(200).json(data);
    } catch (error) {
        console.error("Error getKinerjaById:", error);
        res.status(500).json({ message: "Gagal mengambil data kinerja member" });
    }
};

// 🔹 CREATE data kinerja baru
exports.createKinerja = async (req, res) => {
    try {
        const { id_member, jumlah_proyek, jumlah_followup, rate } = req.body;

        const member = await Member.findByPk(id_member);
        if (!member)
            return res.status(404).json({ message: "Member tidak ditemukan" });

        const newKinerja = await KinerjaMember.create({
            id_member,
            jumlah_proyek,
            jumlah_followup,
            rate,
        });

        res.status(201).json({
            message: "Kinerja member berhasil ditambahkan",
            data: newKinerja,
        });
    } catch (error) {
        console.error("Error createKinerja:", error);
        res.status(500).json({ message: "Gagal menambahkan kinerja member" });
    }
};

// 🔹 UPDATE data kinerja member
exports.updateKinerja = async (req, res) => {
    try {
        const { id } = req.params;
        const { jumlah_proyek, jumlah_followup, rate } = req.body;

        const kinerja = await KinerjaMember.findByPk(id);
        if (!kinerja)
            return res.status(404).json({ message: "Kinerja member tidak ditemukan" });

        await kinerja.update({
            jumlah_proyek,
            jumlah_followup,
            rate,
        });

        res.status(200).json({
            message: "Data kinerja member berhasil diperbarui",
            data: kinerja,
        });
    } catch (error) {
        console.error("Error updateKinerja:", error);
        res.status(500).json({ message: "Gagal memperbarui data kinerja member" });
    }
};

// 🔹 DELETE data kinerja member
exports.deleteKinerja = async (req, res) => {
    try {
        const { id } = req.params;

        const kinerja = await KinerjaMember.findByPk(id);
        if (!kinerja)
            return res.status(404).json({ message: "Kinerja member tidak ditemukan" });

        await kinerja.destroy();

        res.status(200).json({ message: "Kinerja member berhasil dihapus" });
    } catch (error) {
        console.error("Error deleteKinerja:", error);
        res.status(500).json({ message: "Gagal menghapus data kinerja member" });
    }
};