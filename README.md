# PetCare

Página web multimedia de una clínica veterinaria de demostración. Usa Angular,
Node.js con Express, MySQL y Ollama con Gemma 3.

## Cómo ejecutar el proyecto

1. Inicia MySQL e importa `petcare.sql` y después `fotos_petcare.sql` en phpMyAdmin.
2. Abre Ollama. Si falta el modelo, ejecuta `ollama pull gemma3:4b`.
3. En `backend`, copia `.env.example` como `.env` y ajusta los datos de MySQL.
4. En `backend`, ejecuta `npm install` y luego `npm start`.
5. En otra terminal, dentro de `frontend`, ejecuta `npm install` y luego `npm start`.
6. Abre http://localhost:4201. La API funciona en http://127.0.0.1:3001.
