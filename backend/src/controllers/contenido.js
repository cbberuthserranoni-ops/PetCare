const contenidoModel = require("../models/contenido");

function responderConsulta(consultar) {
  return async (req, res) => {
    try {
      const datos = await consultar();

      if (datos === null) {
        return res.status(404).json({ error: "Información no encontrada" });
      }

      res.json(datos);
    } catch (error) {
      console.error("Error al consultar el contenido:", error.message);
      res.status(500).json({ error: "No se pudo consultar la información" });
    }
  };
}

module.exports = {
  obtenerClinica: responderConsulta(contenidoModel.obtenerClinica),
  listarEspecialidades: responderConsulta(contenidoModel.listarEspecialidades),
  listarPrecios: responderConsulta(contenidoModel.listarPrecios),
  listarMultimedia: responderConsulta(contenidoModel.listarMultimedia),
};