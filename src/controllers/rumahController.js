const Rumah = require("../models/Rumah");
const Properti = require("../models/Properti");
const Member = require("../models/Member");
const multer = require("multer");

// simpan file gambar ke memory (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


//
// 📄 GET semua Rumah
//
exports.getAllRumah = async (req, res) => {
    try {
        const data = await Rumah.findAll({
            include: [
                { model: Properti, attributes: ["id_properti", "nama_properti"] },
            ],
            order: [["id_rumah", "DESC"]],
        });

        const result = data.map((item) => ({
            ...item.toJSON(),
            image: item.image
                ? `data:image/jpeg;base64,${item.image.toString("base64")}`
                : null,
        }));

        res.status(200).json({
            success: true,
            message: "Data rumah berhasil diambil",
            data: result,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data rumah",
        });
    }
};


//
// 📄 GET rumah berdasarkan ID
//
exports.getRumahById = async (req, res) => {
    try {
        const { id } = req.params;

        const rumah = await Rumah.findByPk(id, {
            include: [
                { model: Properti, attributes: ["id_properti", "nama_properti"] },
            ],
        });

        if (!rumah) {
            return res.status(404).json({
                success: false,
                message: "Rumah tidak ditemukan",
            });
        }

        const data = rumah.toJSON();
        if (data.image) {
            data.image = `data:image/jpeg;base64,${data.image.toString("base64")}`;
        }

        res.status(200).json({
            success: true,
            data,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data rumah",
        });
    }
};


//
// ➕ TAMBAH rumah baru
//
exports.createRumah = [
    upload.single("image"),
    async (req, res) => {
        try {
            const {
                tipe,
                lb,
                lt,
                jml_kamar,
                jml_lantai,
                harga,
                id_properti,
                id_member
            } = req.body;

            // Validasi member ada
            const member = await Member.findByPk(id_member);
            if (!member) {
                return res.status(404).json({
                    success: false,
                    message: "Member tidak ditemukan",
                });
            }

            const rumah = await Rumah.create({
                tipe,
                lb,
                lt,
                jml_kamar,
                jml_lantai,
                harga,
                id_properti,
                id_member,
                image: req.file ? req.file.buffer : null,
            });

            res.status(201).json({
                success: true,
                message: "Rumah berhasil ditambahkan",
                data: rumah,
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Gagal menambahkan rumah",
            });
        }
    },
];


//
// ✏️ UPDATE rumah berdasarkan ID
//
exports.updateRumah = [
    upload.single("image"),
    async (req, res) => {
        try {
            const { id } = req.params;
            const {
                tipe,
                lb,
                lt,
                jml_kamar,
                jml_lantai,
                harga,
                id_properti,
            } = req.body;

            const rumah = await Rumah.findByPk(id);

            if (!rumah) {
                return res.status(404).json({
                    success: false,
                    message: "Rumah tidak ditemukan",
                });
            }

            await rumah.update({
                tipe,
                lb,
                lt,
                jml_kamar,
                jml_lantai,
                harga,
                id_properti,
                image: req.file ? req.file.buffer : rumah.image,
            });

            res.status(200).json({
                success: true,
                message: "Rumah berhasil diperbarui",
                data: rumah,
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Gagal memperbarui rumah",
            });
        }
    },
];


//
// 🗑️ HAPUS rumah berdasarkan ID
//
exports.deleteRumah = async (req, res) => {
    try {
        const { id } = req.params;

        const rumah = await Rumah.findByPk(id);
        if (!rumah) {
            return res.status(404).json({
                success: false,
                message: "Rumah tidak ditemukan",
            });
        }

        await rumah.destroy();

        res.status(200).json({
            success: true,
            message: "Rumah berhasil dihapus",
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus rumah",
        });
    }
};