import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import type { OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PetCareApiService } from './petcare-api.service';
import type { Clinica, Especialidad, Multimedia, Precio } from './petcare-api.service';
import { ServiciosService } from './servicios.service';
import type { Servicio } from './servicios.service';

interface PaginaPetCare {
  clinica: Clinica;
  servicios: Servicio[];
  especialidades: Especialidad[];
  precios: Precio[];
  multimedia: Multimedia[];
}

interface MensajeChat {
  autor: 'Tú' | 'PetCare';
  texto: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DecimalPipe, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App implements OnInit {
  private readonly api = inject(PetCareApiService);
  private readonly serviciosApi = inject(ServiciosService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly pagina = signal<PaginaPetCare | null>(null);
  readonly errorCarga = signal('');
  readonly portada = computed(() =>
    this.pagina()?.multimedia.find((medio) => medio.seccion === 'inicio' && medio.tipo === 'video'),
  );
  readonly fotos = computed(() =>
    this.pagina()?.multimedia.filter(
      (medio) => medio.seccion === 'nosotros' && medio.tipo === 'imagen',
    ) ?? [],
  );
  readonly videoEnPausa = signal(true);

  readonly formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    telefono: ['', Validators.maxLength(25)],
    asunto: ['', [Validators.required, Validators.maxLength(150)]],
    mensaje: ['', [Validators.required, Validators.maxLength(2000)]],
  });
  readonly enviandoContacto = signal(false);
  readonly confirmacionContacto = signal('');
  readonly errorContacto = signal('');

  readonly chatAbierto = signal(false);
  readonly pregunta = this.fb.control('', [Validators.required, Validators.maxLength(4000)]);
  readonly mensajes = signal<MensajeChat[]>([]);
  readonly esperandoRespuesta = signal(false);
  readonly errorChat = signal('');

  ngOnInit() {
    this.cargarPagina();
  }

  cargarPagina() {
    this.errorCarga.set('');

    forkJoin({
      clinica: this.api.obtenerClinica(),
      servicios: this.serviciosApi.listar(),
      especialidades: this.api.listarEspecialidades(),
      precios: this.api.listarPrecios(),
      multimedia: this.api.listarMultimedia(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pagina) => this.pagina.set(pagina),
        error: () => this.errorCarga.set('No pudimos cargar la información de PetCare.'),
      });
  }

  urlMultimedia(ruta: string) {
    return this.api.urlMultimedia(ruta);
  }

  async alternarVideo(video: HTMLVideoElement) {
    if (!video.paused) {
      video.pause();
      return;
    }

    try {
      await video.play();
    } catch {
      this.videoEnPausa.set(true);
    }
  }

  prepararCita() {
    this.formulario.controls.asunto.setValue('Solicitud de cita');
  }

  enviarContacto() {
    if (this.enviandoContacto()) {
      return;
    }

    this.confirmacionContacto.set('');
    this.errorContacto.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.errorContacto.set('Completa los campos obligatorios y revisa tu correo.');
      return;
    }

    this.enviandoContacto.set(true);
    this.api.crearContacto(this.formulario.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ mensaje }) => {
          this.confirmacionContacto.set(mensaje);
          this.formulario.reset();
          this.enviandoContacto.set(false);
        },
        error: (error: unknown) => {
          this.errorContacto.set(this.mensajeDeError(error, 'No pudimos enviar el mensaje.'));
          this.enviandoContacto.set(false);
        },
      });
  }

  enviarPregunta() {
    const texto = this.pregunta.value.trim();

    if (!texto || this.pregunta.invalid || this.esperandoRespuesta()) {
      return;
    }

    this.mensajes.update((mensajes) => [...mensajes, { autor: 'Tú', texto }]);
    this.pregunta.reset();
    this.errorChat.set('');
    this.esperandoRespuesta.set(true);

    this.api.preguntar(texto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ response }) => {
          this.mensajes.update((mensajes) => [...mensajes, { autor: 'PetCare', texto: response }]);
          this.esperandoRespuesta.set(false);
        },
        error: (error: unknown) => {
          this.errorChat.set(this.mensajeDeError(error, 'No pudimos conectar con el asistente.'));
          this.esperandoRespuesta.set(false);

          if (!this.pregunta.value.trim()) {
            this.pregunta.setValue(texto);
          }
        },
      });
  }

  private mensajeDeError(error: unknown, alternativo: string) {
    if (error instanceof HttpErrorResponse && typeof error.error?.error === 'string') {
      return error.error.error;
    }

    return alternativo;
  }
}
