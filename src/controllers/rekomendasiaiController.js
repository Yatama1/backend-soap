// file: controllers/rekomendasiAiController.js
const Rekomendasi_ai = require("../models/Rekomendasi_ai");
const Cabuy = require("../models/Cabuy");
const Properti = require("../models/Properti");

//
// 📄 GET semua rekomendasi AI
//
exports.getAllRekomendasi = async (req, res) => {
  try {
    const data = await Rekomendasi_ai.findAll({
      include: [
        { model: Cabuy, attributes: ["id_cabuy", "nama_cabuy"] },
        { model: Properti, attributes: ["id_properti", "nama_properti"] },
      ],
      order: [["id_rekomendasi", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Data rekomendasi AI berhasil diambil",
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data rekomendasi AI",
    });
  }
};

//
// 📄 GET rekomendasi AI berdasarkan ID
//
exports.getRekomendasiById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Rekomendasi_ai.findByPk(id, {
      include: [
        { model: Cabuy, attributes: ["id_cabuy", "nama_cabuy"] },
        { model: Properti, attributes: ["id_properti", "nama_properti"] },
      ],
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Rekomendasi AI tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data rekomendasi AI",
    });
  }
};

//
// ➕ TAMBAH rekomendasi AI baru
//
exports.createRekomendasi = async (req, res) => {
  try {
    const { skor, id_cabuy, id_properti } = req.body;

    const rekomendasi = await Rekomendasi_ai.create({
      skor,
      id_cabuy,
      id_properti,
    });

    res.status(201).json({
      success: true,
      message: "Rekomendasi AI berhasil ditambahkan",
      data: rekomendasi,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan rekomendasi AI",
    });
  }
};

//
// ✏️ UPDATE rekomendasi AI berdasarkan ID
//
exports.updateRekomendasi = async (req, res) => {
  try {
    const { id } = req.params;
    const { skor, id_cabuy, id_properti } = req.body;

    const rekomendasi = await Rekomendasi_ai.findByPk(id);
    if (!rekomendasi) {
      return res.status(404).json({
        success: false,
        message: "Rekomendasi AI tidak ditemukan",
      });
    }

    await rekomendasi.update({
      skor,
      id_cabuy,
      id_properti,
    });

    res.status(200).json({
      success: true,
      message: "Rekomendasi AI berhasil diperbarui",
      data: rekomendasi,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui rekomendasi AI",
    });
  }
};

//
// 🗑️ HAPUS rekomendasi AI berdasarkan ID
//
exports.deleteRekomendasi = async (req, res) => {
  try {
    const { id } = req.params;

    const rekomendasi = await Rekomendasi_ai.findByPk(id);
    if (!rekomendasi) {
      return res.status(404).json({
        success: false,
        message: "Rekomendasi AI tidak ditemukan",
      });
    }

    await rekomendasi.destroy();

    res.status(200).json({
      success: true,
      message: "Rekomendasi AI berhasil dihapus",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus rekomendasi AI",
    });
  }
};