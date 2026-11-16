const contenido = require("../models/contenido");
const servicios = require("../models/servicios");

const OLLAMA_URL = (process.env.OLLAMA_URL || "http://127.0.0.1:11434").replace(/\/+$/, "");
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gemma3:4b";
const OLLAMA_TIMEOUT_MS = 120000;
const MAX_PROMPT_LENGTH = 4000;

async function prompt(req, res) {
  const pregunta = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";

  if (!pregunta || pregunta.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({
      error: `Escribe una pregunta de hasta ${MAX_PROMPT_LENGTH} caracteres`,
    });
  }

  let datosPetCare;

  try {
    const [clinica, listaServicios, especialidades, precios] = await Promise.all([
      contenido.obtenerClinica(),
      servicios.listar(),
      contenido.listarEspecialidades(),
      contenido.listarPrecios(),
    ]);

    datosPetCare = { clinica, servicios: listaServicios, especialidades, precios };
  } catch (error) {
    console.error("Error al consultar los datos de PetCare:", error.message);
    return res.status(503).json({ error: "No se pudieron consultar los datos de PetCare" });
  }

  const instrucciones = `
Eres el asistente informativo de PetCare. Responde en español con frases sencillas.
Responde preguntas sobre servicios, especialidades, precios, horarios y ubicación.
Para los datos de la clínica, usa únicamente la información de abajo.
Si un dato es nulo o falta, indica que no está disponible. No inventes datos.
Indica que los precios y horarios son de demostración si te preguntan por ellos.
Si la pregunta es sobre síntomas o tratamientos, orienta a una consulta veterinaria.
No des diagnósticos, medicamentos ni dosis.

Datos de PetCare:
${JSON.stringify(datosPetCare)}
`;

  const signal = AbortSignal.timeout(OLLAMA_TIMEOUT_MS);

  try {
    const respuesta = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        system: instrucciones,
        prompt: pregunta,
        stream: false,
      }),
      signal,
    });

    if (!respuesta.ok) {
      console.error("Ollama respondió con estado:", respuesta.status);
      return res.status(502).json({ error: "Ollama no pudo responder la pregunta" });
    }

    const datos = await respuesta.json();

    if (typeof datos?.response !== "string" || !datos.response.trim()) {
      return res.status(502).json({ error: "Ollama devolvió una respuesta vacía o inválida" });
    }

    res.json({ response: datos.response.trim() });
  } catch (error) {
    console.error("Error al consultar Ollama:", error.message);

    if (signal.aborted) {
      return res.status(504).json({ error: "Ollama tardó demasiado en responder" });
    }

    res.status(502).json({ error: "No se pudo obtener una respuesta de Ollama" });
  }
}

module.exports = { prompt };