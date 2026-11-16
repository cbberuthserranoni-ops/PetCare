const serviciosModel = require("../models/servicios");

async function listar(req, res) {
  try {
    const servicios = await serviciosModel.listar();
    res.json(servicios);
  } catch (error) {
    console.error("Error al consultar los servicios:", error.message);
    res.status(500).json({ error: "No se pudieron consultar los servicios" });
  }
}

module.exports = { listar };