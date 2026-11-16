const database = require("../config/database");

async function listar() {
  const [servicios] = await database.query(`
    SELECT id, nombre, descripcion
    FROM servicios
    WHERE activo = 1
    ORDER BY orden, id
  `);

  return servicios;
}

module.exports = { listar };