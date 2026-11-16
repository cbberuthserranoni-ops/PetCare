import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class ServiciosService {
  private readonly http = inject(HttpClient);

  listar() {
    return this.http.get<Servicio[]>('http://127.0.0.1:3001/api/servicios');
  }
}