const limites = {
  nombre: 120,
  correo: 150,
  asunto: 150,
  mensaje: 2000,
};

function validarContacto(req, res, next) {
  const datos = req.body;

  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return res.status(400).json({ error: "Envía los datos como un objeto JSON" });
  }

  const contacto = {};

  for (const [campo, limite] of Object.entries(limites)) {
    const valor = typeof datos[campo] === "string" ? datos[campo].trim() : "";

    if (!valor || valor.length > limite) {
      return res.status(400).json({
        error: `El campo ${campo} es obligatorio y admite hasta ${limite} caracteres`,
      });
    }

    contacto[campo] = valor;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto.correo)) {
    return res.status(400).json({ error: "El correo no tiene un formato válido" });
  }

  const { telefono } = datos;

  if (telefono != null && (typeof telefono !== "string" || telefono.trim().length > 25)) {
    return res.status(400).json({ error: "El teléfono admite hasta 25 caracteres" });
  }

  contacto.telefono = telefono?.trim() || null;
  res.locals.contacto = contacto;
  next();
}

module.exports = validarContacto;