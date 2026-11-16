const express = require("express");
const serviciosController = require("../controllers/servicios");

const router = express.Router();

router.get("/", serviciosController.listar);

module.exports = router;