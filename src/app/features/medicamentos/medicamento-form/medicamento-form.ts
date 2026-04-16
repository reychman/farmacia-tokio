import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MedicamentoService, Medicamento } from '../../../core/services/medicamento';

@Component({
  selector: 'app-medicamento-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicamento-form.html',
})
export class MedicamentoFormComponent implements OnInit {
  form: Medicamento = {
    nombre: '',
    laboratorio: '',
    precio: 0,
    stock: 0,
    unidad: 'caja',
    descripcion: '',
    fechaVencimiento: '',
  };

  esEdicion = false;
  mostrarMensaje = false;
  mensajeTexto = '';
  tipomensaje: 'success' | 'error' = 'success';

  constructor(
    private medService: MedicamentoService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      try {
        const med = await this.medService.obtener(parseInt(id));
        this.form = { ...med };
        console.log('✏️ Medicamento cargado para editar:', this.form);
        this.cdr.detectChanges();
      } catch (error) {
        console.error('❌ Error cargando medicamento:', error);
        alert('Error al cargar el medicamento');
      }
    }
  }

  async guardar() {
    if (!this.form.nombre || !this.form.laboratorio) {
      this.mostrarMensaje = true;
      this.mensajeTexto = 'Nombre y laboratorio son obligatorios';
      this.tipomensaje = 'error';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.mostrarMensaje = false;
        this.cdr.detectChanges();
      }, 3000);
      return;
    }
    
    try {
      if (this.esEdicion) {
        await this.medService.actualizar(this.form);
        this.mensajeTexto = '✅ Medicamento actualizado correctamente';
        console.log('✅ Medicamento actualizado:', this.form);
      } else {
        await this.medService.agregar(this.form);
        this.mensajeTexto = '✅ Medicamento guardado correctamente';
        console.log('✅ Medicamento agregado:', this.form);
      }
      this.tipomensaje = 'success';
      this.mostrarMensaje = true;
      this.cdr.detectChanges();
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        this.router.navigate(['/medicamentos']);
      }, 3000);
    } catch (error) {
      this.mensajeTexto = '❌ Error al guardar el medicamento';
      this.tipomensaje = 'error';
      this.mostrarMensaje = true;
      console.error('Error:', error);
      this.cdr.detectChanges();
      
      setTimeout(() => {
        this.mostrarMensaje = false;
        this.cdr.detectChanges();
      }, 3000);
    }
  }

  cancelar() {
    this.router.navigate(['/medicamentos']);
  }
}