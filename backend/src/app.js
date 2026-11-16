const express = require("express");
const database = require("./config/database");
const serviciosRoutes = require("./routes/servicios");
const contenidoRoutes = require("./routes/contenido");
const contactosRoutes = require("./routes/contactos");
const chatbotRoutes = require("./routes/chatbot");
const path = require("node:path");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:4201" }));
app.use(express.json());
app.use("/media", express.static(path.join(__dirname, "..", "public", "media")));
const port = Number(process.env.PORT || 3001);

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await database.query("SELECT DATABASE() AS base_activa");
    res.json({ estado: "ok", base_activa: rows[0].base_activa });
  } catch (error) {
    console.error("Error al consultar MySQL:", error.message);
    res.status(503).json({ error: "No se pudo consultar MySQL" });
  }
});

app.use("/api/servicios", serviciosRoutes);
app.use("/api", contenidoRoutes);
app.use("/api/contactos", contactosRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.listen(port, "127.0.0.1", () => {
  console.log(`API de PetCare disponible en http://127.0.0.1:${port}`);
});