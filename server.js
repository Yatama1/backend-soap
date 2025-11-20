const express = require("express");
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Routing sederhana
app.get("/", (req, res) => {
  res.json({ message: "Backend berjalan!" });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
