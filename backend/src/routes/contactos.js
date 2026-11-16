const express = require("express");
const contactosController = require("../controllers/contactos");
const validarContacto = require("../middlewares/validar-contacto");

const router = express.Router();

router.post("/", validarContacto, contactosController.crear);

module.exports = router;