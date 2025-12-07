const Properti = require("../models/Properti");
const Member = require("../models/Member");

// 📄 GET semua properti
exports.getAllProperti = async (req, res) => {
    try {
        const data = await Properti.findAll({
            order: [["id_properti", "DESC"]],
        });

        const result = data.map((item) => ({
            ...item.toJSON(),
            image: item.image
                ? `data:image/jpeg;base64,${item.image.toString("base64")}`
                : null,
        }));

        res.status(200).json({
            success: true,
            message: "Data properti berhasil diambil",
            data: result,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data properti",
        });
    }
};


//
// 📄 GET properti berdasarkan ID
//
exports.getPropertiById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await Properti.findByPk(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Properti tidak ditemukan",
            });
        }

        const propertiData = data.toJSON();
        if (propertiData.image) {
            propertiData.image = `data:image/jpeg;base64,${propertiData.image.toString("base64")}`;
        }

        res.status(200).json({
            success: true,
            data: propertiData,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data properti",
        });
    }
};


//
// ➕ TAMBAH properti baru
//
exports.createProperti = [
    async (req, res) => {
        try {
            const { nama_properti, deskripsi, lokasi, kontraktor, id_member } = req.body;

            // cek apakah member adalah senior leader
            const member = await Member.findOne({
                where: {
                    id_member,
                    jabatan: "Senior leader",
                },
            });

            if (!member) {
                return res.status(403).json({
                    success: false,
                    message: "Hanya Senior leader yang dapat menambahkan properti.",
                });
            }

            const newProperti = await Properti.create({
                nama_properti,
                deskripsi,
                lokasi,
                kontraktor,
                id_member: member.id_member,
            });

            res.status(201).json({
                success: true,
                message: "Properti berhasil dibuat",
                data: newProperti,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Gagal menyimpan properti",
            });
        }
    },
];


//
// ✏️ UPDATE properti
//
exports.updateProperti = [
    async (req, res) => {
        try {
            const { id } = req.params;
            const { nama_properti, deskripsi, lokasi, kontraktor } = req.body;

            const properti = await Properti.findByPk(id);

            if (!properti) {
                return res.status(404).json({
                    success: false,
                    message: "Properti tidak ditemukan",
                });
            }

            await properti.update({
                nama_properti,
                deskripsi,
                lokasi,
                kontraktor,
            });

            res.status(200).json({
                success: true,
                message: "Properti berhasil diperbarui",
                data: properti,
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Gagal memperbarui properti",
            });
        }
    },
];


//
// 🗑️ HAPUS properti
//
exports.deleteProperti = async (req, res) => {
    try {
        const { id } = req.params;

        const properti = await Properti.findByPk(id);

        if (!properti) {
            return res.status(404).json({
                success: false,
                message: "Properti tidak ditemukan",
            });
        }

        await properti.destroy();

        res.status(200).json({
            success: true,
            message: "Properti berhasil dihapus",
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus properti",
        });
    }
};