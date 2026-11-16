const database = require("../config/database");

async function obtenerClinica() {
  const [filas] = await database.query(`
    SELECT nombre, lema, descripcion_inicio, historia, direccion,
           telefono, correo, horario
    FROM clinica
    ORDER BY id
    LIMIT 1
  `);

  return filas[0] ?? null;
}

async function listarEspecialidades() {
  const [filas] = await database.query(`
    SELECT id, nombre, descripcion
    FROM especialidades
    WHERE activo = 1
    ORDER BY orden, id
  `);

  return filas;
}

async function listarPrecios() {
  const [filas] = await database.query(`
    SELECT p.id, s.nombre AS servicio, p.detalle, p.monto, p.moneda
    FROM precios AS p
    INNER JOIN servicios AS s ON s.id = p.servicio_id
    WHERE p.activo = 1 AND s.activo = 1
    ORDER BY p.orden, p.id
  `);

  return filas;
}

async function listarMultimedia() {
  const [filas] = await database.query(`
    SELECT id, seccion, tipo, titulo, url_archivo, url_fuente,
           texto_alternativo
    FROM multimedia
    WHERE activo = 1
    ORDER BY orden, id
  `);

  return filas;
}

module.exports = {
  obtenerClinica,
  listarEspecialidades,
  listarPrecios,
  listarMultimedia,
};