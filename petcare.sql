-- PetCare. Tablas y datos de demostración para la práctica.
-- Guarda e importa este archivo como UTF-8.
CREATE DATABASE IF NOT EXISTS veterinaria_petcare
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE veterinaria_petcare;
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS clinica (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  lema VARCHAR(160) NOT NULL,
  descripcion_inicio VARCHAR(350) NOT NULL,
  historia TEXT NOT NULL,
  direccion VARCHAR(200) NOT NULL,
  telefono VARCHAR(25) DEFAULT NULL,
  correo VARCHAR(150) DEFAULT NULL,
  horario VARCHAR(200) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS servicios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT NOT NULL,
  orden SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS especialidades (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT NOT NULL,
  orden SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS precios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  servicio_id INT UNSIGNED NOT NULL,
  detalle VARCHAR(160) NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  moneda CHAR(3) NOT NULL DEFAULT 'BOB',
  orden SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_precios_servicio (servicio_id),
  CONSTRAINT fk_precios_servicio
    FOREIGN KEY (servicio_id) REFERENCES servicios (id),
  CONSTRAINT chk_precios_monto CHECK (monto >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS multimedia (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  seccion ENUM('inicio', 'nosotros') NOT NULL,
  tipo ENUM('video', 'imagen') NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  url_archivo VARCHAR(500) NOT NULL,
  url_fuente VARCHAR(500) DEFAULT NULL,
  texto_alternativo VARCHAR(250) DEFAULT NULL,
  orden SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contactos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(150) NOT NULL,
  telefono VARCHAR(25) DEFAULT NULL,
  asunto VARCHAR(150) NOT NULL,
  mensaje TEXT NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Los registros iniciales utilizan IDs fijos para poder volver a importar.
START TRANSACTION;

INSERT INTO clinica
  (id, nombre, lema, descripcion_inicio, historia, direccion, telefono, correo, horario)
VALUES
  (1, 'PetCare', 'Cuidamos a quienes llenan tu vida de alegría',
   'Consulta nuestros servicios veterinarios para perros y gatos.',
   'PetCare es una clínica ficticia creada para esta práctica. La página permite consultar servicios, especialidades, precios y enviar mensajes.',
   'Cochabamba, Bolivia (dirección de demostración)',
   NULL, NULL, 'Lunes a sábado, de 08:30 a 18:00 (horario de demostración)')
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO servicios (id, nombre, descripcion, orden)
VALUES
  (1, 'Consulta general', 'Atención veterinaria general para perros y gatos.', 1),
  (2, 'Vacunación', 'Aplicación de vacunas previa consulta veterinaria.', 2),
  (3, 'Desparasitación', 'Consulta para planificar la desparasitación de la mascota.', 3),
  (4, 'Baño y peluquería', 'Baño, cepillado y arreglo del pelaje.', 4),
  (5, 'Control dental', 'Revisión de dientes y encías durante una consulta.', 5)
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO especialidades (id, nombre, descripcion, orden)
VALUES
  (1, 'Medicina preventiva', 'Consultas de seguimiento, vacunación y desparasitación.', 1),
  (2, 'Dermatología', 'Consultas relacionadas con la piel y el pelaje.', 2),
  (3, 'Odontología veterinaria', 'Evaluación dental y seguimiento de la salud oral.', 3)
ON DUPLICATE KEY UPDATE id = id;

-- Tarifas ficticias, expresadas en bolivianos.
INSERT INTO precios (id, servicio_id, detalle, monto, moneda, orden)
VALUES
  (1, 1, 'Consulta individual', 80.00, 'BOB', 1),
  (2, 2, 'Aplicación de vacuna (precio de ejemplo)', 110.00, 'BOB', 2),
  (3, 3, 'Servicio básico', 60.00, 'BOB', 3),
  (4, 4, 'Mascota pequeña', 75.00, 'BOB', 4),
  (5, 5, 'Evaluación dental', 95.00, 'BOB', 5)
ON DUPLICATE KEY UPDATE id = id;

-- La API servirá el MP4 desde /media cuando se incorpore el archivo al backend.
INSERT INTO multimedia
  (id, seccion, tipo, titulo, url_archivo, url_fuente, texto_alternativo, orden)
VALUES
  (1, 'inicio', 'video', 'Border collie corriendo en el parque',
   '/media/portada-perros.mp4',
   'https://www.pexels.com/video/energetic-border-collie-running-in-park-35235414/',
   'Un border collie corre por un parque verde.', 1)
ON DUPLICATE KEY UPDATE id = id;

COMMIT;
