const Admin = require("../models/Admin");
const Member = require("../models/Member");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Cek di tabel admin dulu
        let user = await Admin.findOne({ where: { email } });

        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).json({ message: "Password salah" });

            const token = jwt.sign(
                { id: user.id_admin, role: "admin" },
                process.env.JWT_SECRET
            );

            return res.json({
                message: "Login sebagai admin",
                role: "admin",
                token,
                nama: user.nama,
            });
        }

        // Jika bukan admin → cek di tabel member
        user = await Member.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: "Email tidak ditemukan" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Password salah" });

        const token = jwt.sign(
            { id: user.id_member, role: user.jabatan },
            process.env.JWT_SECRET
        );

        return res.json({
            message: "Login berhasil",
            role: user.jabatan,
            token,
            nama: user.nama,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
