const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Token tidak ada" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (err) {
        console.error("AUTH ERROR:", err);
        return res.status(401).json({ message: "Token tidak valid" });
    }
};
