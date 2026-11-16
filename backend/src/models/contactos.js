const database = require("../config/database");

async function crear({ nombre, correo, telefono, asunto, mensaje }) {
  const [resultado] = await database.execute(
    `INSERT INTO contactos (nombre, correo, telefono, asunto, mensaje)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, correo, telefono, asunto, mensaje]
  );

  return resultado.insertId;
}

module.exports = { crear };