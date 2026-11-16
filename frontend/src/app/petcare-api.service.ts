import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

const BACKEND = 'http://127.0.0.1:3001';

export interface Clinica {
  nombre: string;
  lema: string;
  descripcion_inicio: string;
  historia: string;
  direccion: string;
  telefono: string | null;
  correo: string | null;
  horario: string;
}

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Precio {
  id: number;
  servicio: string;
  detalle: string;
  monto: string | number;
  moneda: string;
}

export interface Multimedia {
  id: number;
  seccion: 'inicio' | 'nosotros';
  tipo: 'video' | 'imagen';
  titulo: string;
  url_archivo: string;
  url_fuente: string | null;
  texto_alternativo: string | null;
}

export interface Contacto {
  nombre: string;
  correo: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class PetCareApiService {
  private readonly http = inject(HttpClient);

  obtenerClinica() {
    return this.http.get<Clinica>(BACKEND + '/api/clinica');
  }

  listarEspecialidades() {
    return this.http.get<Especialidad[]>(BACKEND + '/api/especialidades');
  }

  listarPrecios() {
    return this.http.get<Precio[]>(BACKEND + '/api/precios');
  }

  listarMultimedia() {
    return this.http.get<Multimedia[]>(BACKEND + '/api/multimedia');
  }

  crearContacto(contacto: Contacto) {
    return this.http.post<{ id: number; mensaje: string }>(
      BACKEND + '/api/contactos',
      contacto,
    );
  }

  preguntar(prompt: string) {
    return this.http.post<{ response: string }>(BACKEND + '/api/chatbot', { prompt });
  }

  urlMultimedia(ruta: string) {
    return new URL(ruta, BACKEND).href;
  }
}
