const express = require("express");
const contenidoController = require("../controllers/contenido");

const router = express.Router();

router.get("/clinica", contenidoController.obtenerClinica);
router.get("/especialidades", contenidoController.listarEspecialidades);
router.get("/precios", contenidoController.listarPrecios);
router.get("/multimedia", contenidoController.listarMultimedia);

module.exports = router;