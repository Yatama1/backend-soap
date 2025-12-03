const Member = require("../models/Member");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔹 LOGIN MEMBER
exports.loginMember = async (req, res) => {
    try {
        const { email, password } = req.body;

        const member = await Member.findOne({ where: { email } });
        if (!member) return res.status(404).json({ message: "Email tidak terdaftar" });

        const isValid = await bcrypt.compare(password, member.password);
        if (!isValid) return res.status(401).json({ message: "Password salah" });

        const token = jwt.sign(
            {
                id: member.id_member,
                role: member.jabatan
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login berhasil",
            token,
            data: {
                id_member: member.id_member,
                nama: member.nama,
                email: member.email,
                jabatan: member.jabatan
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan saat login" });
    }
};

// 🔹 GET MEMBERS (role-based)
// 🔹 GET MEMBERS (role-based) -- updated to support query params like ?leaderId=... and ?role=leader
exports.getMembers = async (req, res) => {
  try {
    const { id: requesterId, role: requesterRole } = req.user; // dari auth middleware
    const { leaderId: qLeaderId, role: qRole } = req.query;    // query params

    let members = [];

    // --- 1) Jika ada query leaderId -> kembalikan member bawahannya (dengan pengecekan akses) ---
    if (qLeaderId) {
      const leaderId = Number(qLeaderId);

      // pastikan leader itu memang ada dan memang jabatan 'leader'
      const leaderRecord = await Member.findOne({ where: { id_member: leaderId } });
      if (!leaderRecord) {
        return res.status(404).json({ message: "Leader tidak ditemukan" });
      }

      // cek jabatan (kadang data inconsistent, tapi idealnya jabatan === 'leader')
      // kita tidak menolak jika jabatan bukan 'leader' tapi cek akses berbasis relasi
      // cek hak akses requester
      if (requesterRole === "admin") {
        // admin boleh
      } else if (requesterRole === "senior_leader") {
        // senior hanya boleh lihat bawahan leader jika leaderRecord.id_senior === requesterId
        if (Number(leaderRecord.id_senior) !== Number(requesterId)) {
          return res.status(403).json({ message: "Tidak punya akses melihat member untuk leader ini" });
        }
      } else if (requesterRole === "leader") {
        // leader hanya boleh meminta bawahannya sendiri
        if (Number(leaderId) !== Number(requesterId)) {
          return res.status(403).json({ message: "Leader hanya boleh melihat member bawahan sendiri" });
        }
      } else {
        // member atau lain-lain tidak diizinkan
        return res.status(403).json({ message: "Tidak punya akses" });
      }

      // ambil semua member yang punya id_leader = leaderId
      members = await Member.findAll({
        where: { id_leader: leaderId },
        order: [["id_member", "DESC"]]
      });

      return res.json({ members });
    }

    // --- 2) Jika query role=leader (frontend ingin daftar leaders) ---
    if (qRole === "leader") {
      if (requesterRole === "admin") {
        members = await Member.findAll({ where: { jabatan: "leader" }, order: [["id_member", "DESC"]] });
      } else if (requesterRole === "senior_leader") {
        members = await Member.findAll({ where: { jabatan: "leader", id_senior: requesterId }, order: [["id_member", "DESC"]] });
      } else {
        // leader/member tidak boleh mengambil daftar leaders umum
        return res.status(403).json({ message: "Tidak punya akses melihat daftar leader" });
      }

      return res.json({ members });
    }

    // --- 3) Fallback: tetap dukung behavior lama (role-based default) ---
    if (requesterRole === "admin") {
      members = await Member.findAll({ order: [["id_member", "DESC"]] });
    } else if (requesterRole === "senior_leader") {
      members = await Member.findAll({ where: { id_senior: requesterId }, order: [["id_member", "DESC"]] });
    } else if (requesterRole === "leader") {
      members = await Member.findAll({ where: { id_leader: requesterId }, order: [["id_member", "DESC"]] });
    } else if (requesterRole === "member") {
      members = await Member.findAll({ where: { id_member: requesterId } });
    } else {
      members = [];
    }

    return res.json({ members });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


// 🔹 CREATE MEMBER (role-based)
exports.createMember = async (req, res) => {
    try {
        const { nama, email, password, jabatan } = req.body;
        const creator = req.user; // { id, role }

        // ✅ RULES ROLE
        if (creator.role === "admin" && jabatan !== "senior_leader")
            return res.status(403).json({ message: "Admin hanya bisa membuat Senior Leader" });

        if (creator.role === "senior_leader" && jabatan !== "leader")
            return res.status(403).json({ message: "Senior Leader hanya bisa membuat Leader" });

        if (creator.role === "leader" && jabatan !== "member")
            return res.status(403).json({ message: "Leader hanya bisa membuat Member" });

        if (creator.role === "member")
            return res.status(403).json({ message: "Member tidak boleh menambahkan user" });

        // ✅ HASH PASSWORD
        const hashed = await bcrypt.hash(password, 10);

        // ✅ ASSIGN RELASI OTOMATIS
        const data = {
            nama,
            email,
            password: hashed,
            jabatan,
            id_admin: null,
            id_senior: null,
            id_leader: null
        };

        if (creator.role === "admin") data.id_admin = creator.id;
        if (creator.role === "senior_leader") data.id_senior = creator.id;
        if (creator.role === "leader") data.id_leader = creator.id;

        const newMember = await Member.create(data);

        res.status(201).json({
            message: "Member berhasil dibuat",
            data: newMember
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 🔹 UPDATE MEMBER
exports.updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, email, password, jabatan } = req.body;
        const updater = req.user; // { id, role }

        const member = await Member.findByPk(id);
        if (!member) return res.status(404).json({ message: "Member tidak ditemukan" });

        // Role-based rule: hanya admin, senior leader, leader sesuai hierarchy yang bisa update
        if (updater.role === "admin") {
            // admin bisa update semua senior leader
            if (member.jabatan !== "senior_leader") return res.status(403).json({ message: "Admin hanya bisa update Senior Leader" });
        } else if (updater.role === "senior_leader") {
            if (member.id_senior !== updater.id || member.jabatan !== "leader") return res.status(403).json({ message: "Tidak punya akses update" });
        } else if (updater.role === "leader") {
            if (member.id_leader !== updater.id || member.jabatan !== "member") return res.status(403).json({ message: "Tidak punya akses update" });
        } else {
            return res.status(403).json({ message: "Member tidak punya akses update" });
        }

        // Update fields
        if (nama) member.nama = nama;
        if (email) member.email = email;
        if (jabatan) member.jabatan = jabatan;
        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            member.password = hashed;
        }

        await member.save();

        res.json({ message: "Member berhasil diperbarui", data: member });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 🔹 DELETE MEMBER
exports.deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        const deleter = req.user; // { id, role }

        const member = await Member.findByPk(id);
        if (!member) return res.status(404).json({ message: "Member tidak ditemukan" });

        // Role-based rule: hanya yang sesuai hierarchy bisa delete
        if (deleter.role === "admin") {
            if (member.jabatan !== "senior_leader") return res.status(403).json({ message: "Admin hanya bisa delete Senior Leader" });
        } else if (deleter.role === "senior_leader") {
            if (member.id_senior !== deleter.id || member.jabatan !== "leader") return res.status(403).json({ message: "Tidak punya akses delete" });
        } else if (deleter.role === "leader") {
            if (member.id_leader !== deleter.id || member.jabatan !== "member") return res.status(403).json({ message: "Tidak punya akses delete" });
        } else {
            return res.status(403).json({ message: "Member tidak punya akses delete" });
        }

        await member.destroy();
        res.json({ message: "Member berhasil dihapus" });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
