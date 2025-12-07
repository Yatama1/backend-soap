// controllers/CabuyController.js
const Cabuy = require("../models/Cabuy");


// allowed status enum (sesuaikan dengan model)
const ALLOWED_STATUS = ["Baru", "Follow Up", "Closing", "Lost"];
const MAP_STATUS = { deal: "Closing", closed: "Closing", baru: "Baru" };

/**
 * GET /api/cabuy
 * Ambil semua cabuy
 */
exports.getCabuys = async (req, res) => {
  try {
    const cabuys = await Cabuy.findAll();
    return res.status(200).json(cabuys);
  } catch (err) {
    console.error("Error getCabuys:", err);
    return res.status(500).json({ error: "Gagal mengambil data Cabuy", detail: err.message });
  }
};

/**
 * GET /api/cabuy/:id
 * Ambil 1 cabuy by id
 */
exports.getCabuyById = async (req, res) => {
  try {
    const { id } = req.params;
    const cabuy = await Cabuy.findByPk(id);
    if (!cabuy) return res.status(404).json({ error: "Cabuy tidak ditemukan" });
    return res.status(200).json(cabuy);
  } catch (err) {
    console.error("Error getCabuyById:", err);
    return res.status(500).json({ error: "Gagal mengambil data Cabuy", detail: err.message });
  }
};

/**
 * POST /api/cabuy
 * Buat cabuy baru
 * (disertakan juga update ringan: normalisasi status/id_member/tanggal)
 */
exports.createCabuy = async (req, res) => {
  try {
    let { nama_cabuy, kontak, status, tanggal_follow_up, tanggal_masuk, id_member } = req.body || {};

    // validasi minimal
    if (!nama_cabuy || !kontak) {
      return res.status(400).json({ error: "Nama dan Kontak wajib diisi" });
    }

    // normalize id_member => number atau null
    if (id_member === "" || id_member === undefined || id_member === null) {
      id_member = null;
    } else {
      const n = Number(id_member);
      id_member = Number.isNaN(n) ? null : n;
      // cek eksistensi member kalau diberikan
      if (id_member !== null) {
        const m = await Member.findByPk(id_member);
        if (!m) return res.status(400).json({ error: "Member (id_member) tidak ditemukan" });
      }
    }

    // normalize status
    status = status || "Baru";
    if (!ALLOWED_STATUS.includes(status)) {
      const mapped = MAP_STATUS[(status || "").toLowerCase()];
      status = mapped || "Baru";
    }

    // tanggal boleh null (terima string YYYY-MM-DD atau null)
    tanggal_follow_up = tanggal_follow_up || null;
    tanggal_masuk = tanggal_masuk || null;

    const newCabuy = await Cabuy.create({
      nama_cabuy,
      kontak,
      tanggal_follow_up,
      tanggal_masuk,
      status,
      id_member,
    });

    return res.status(201).json({ message: "Cabuy berhasil dibuat", data: newCabuy });
  } catch (err) {
    console.error("Error createCabuy:", err);
    return res.status(500).json({ error: "Gagal membuat Cabuy", detail: err.message });
  }
};

/**
 * PUT /api/cabuy/:id
 * Update cabuy
 */
exports.updateCabuy = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_cabuy, kontak, status, tanggal_follow_up, tanggal_masuk, id_member } = req.body || {};

    const cabuy = await Cabuy.findByPk(id);
    if (!cabuy) return res.status(404).json({ error: "Cabuy tidak ditemukan" });

    // jika ada id_member pastikan valid atau null
    let normalizedMemberId = cabuy.id_member;
    if (Object.prototype.hasOwnProperty.call(req.body, "id_member")) {
      if (id_member === "" || id_member === undefined || id_member === null) {
        normalizedMemberId = null;
      } else {
        const n = Number(id_member);
        if (Number.isNaN(n)) return res.status(400).json({ error: "id_member tidak valid" });
        const m = await Member.findByPk(n);
        if (!m) return res.status(400).json({ error: "Member (id_member) tidak ditemukan" });
        normalizedMemberId = n;
      }
    }

    // validate status kalau di-submit
    let normalizedStatus = cabuy.status;
    if (Object.prototype.hasOwnProperty.call(req.body, "status")) {
      const s = status || "";
      if (!ALLOWED_STATUS.includes(s)) {
        const mapped = MAP_STATUS[(s || "").toLowerCase()];
        normalizedStatus = mapped || cabuy.status || "Baru";
      } else {
        normalizedStatus = s;
      }
    }

    // tanggal: kalau dikirim gunakan value, kalau tidak tetap
    const normalizedTanggalFollow = Object.prototype.hasOwnProperty.call(req.body, "tanggal_follow_up")
      ? (tanggal_follow_up || null)
      : cabuy.tanggal_follow_up;
    const normalizedTanggalMasuk = Object.prototype.hasOwnProperty.call(req.body, "tanggal_masuk")
      ? (tanggal_masuk || null)
      : cabuy.tanggal_masuk;

    // nama & kontak: jika dikirim, gunakan; jika tidak, tetap
    const updated = await cabuy.update({
      nama_cabuy: Object.prototype.hasOwnProperty.call(req.body, "nama_cabuy") ? nama_cabuy : cabuy.nama_cabuy,
      kontak: Object.prototype.hasOwnProperty.call(req.body, "kontak") ? kontak : cabuy.kontak,
      tanggal_follow_up: normalizedTanggalFollow,
      tanggal_masuk: normalizedTanggalMasuk,
      status: normalizedStatus,
      id_member: normalizedMemberId,
    });

    return res.status(200).json({ message: "Cabuy berhasil diupdate", data: updated });
  } catch (err) {
    console.error("Error updateCabuy:", err);
    return res.status(500).json({ error: "Gagal memperbarui Cabuy", detail: err.message });
  }
};

/**
 * DELETE /api/cabuy/:id
 * Hapus cabuy
 */
exports.deleteCabuy = async (req, res) => {
  try {
    const { id } = req.params;
    const cabuy = await Cabuy.findByPk(id);
    if (!cabuy) return res.status(404).json({ error: "Cabuy tidak ditemukan" });

    // Opsional: cek dependent records (crm, survey, dll.) bila perlu sebelum hapus
    await cabuy.destroy();

    return res.status(200).json({ message: "Cabuy berhasil dihapus" });
  } catch (err) {
    console.error("Error deleteCabuy:", err);
    return res.status(500).json({ error: "Gagal menghapus Cabuy", detail: err.message });
  }
};