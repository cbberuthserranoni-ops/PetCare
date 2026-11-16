const contactosModel = require("../models/contactos");

async function crear(req, res) {
  try {
    const id = await contactosModel.crear(res.locals.contacto);
    res.status(201).json({ id, mensaje: "Contacto guardado correctamente" });
  } catch (error) {
    console.error("Error al guardar el contacto:", error.message);
    res.status(500).json({ error: "No se pudo guardar el contacto" });
  }
}

module.exports = { crear };