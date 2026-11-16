-- Registra las dos fotos de Pexels incluidas en backend/public/media.
USE veterinaria_petcare;
SET NAMES utf8mb4;

INSERT INTO multimedia
  (seccion, tipo, titulo, url_archivo, url_fuente, texto_alternativo, orden)
SELECT
  'nosotros', 'imagen', 'Consulta veterinaria · foto referencial',
  '/media/consulta-veterinaria.jpg',
  'https://www.pexels.com/photo/a-veterinarian-sitting-beside-a-black-dog-lying-on-the-table-6234618/',
  'Un profesional de veterinaria acompaña a un perro negro sobre una mesa de consulta.', 2
WHERE NOT EXISTS (
  SELECT 1 FROM multimedia WHERE url_archivo = '/media/consulta-veterinaria.jpg'
);

INSERT INTO multimedia
  (seccion, tipo, titulo, url_archivo, url_fuente, texto_alternativo, orden)
SELECT
  'nosotros', 'imagen', 'Control general · foto referencial',
  '/media/control-veterinario.jpg',
  'https://www.pexels.com/photo/a-dog-at-the-clinic-6235650/',
  'Un profesional examina a un perro pequeño con un estetoscopio.', 3
WHERE NOT EXISTS (
  SELECT 1 FROM multimedia WHERE url_archivo = '/media/control-veterinario.jpg'
);
