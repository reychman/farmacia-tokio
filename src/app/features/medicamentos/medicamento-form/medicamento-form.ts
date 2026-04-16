import { Component, OnInit } from '@angular/core';
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

  constructor(
    private medService: MedicamentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      const med = await this.medService.obtener(parseInt(id));
      this.form = { ...med };
    }
  }

  async guardar() {
    if (!this.form.nombre || !this.form.laboratorio) {
      alert('Nombre y laboratorio son obligatorios');
      return;
    }
    if (this.esEdicion) {
      await this.medService.actualizar(this.form);
    } else {
      await this.medService.agregar(this.form);
    }
    this.router.navigate(['/medicamentos']);
  }

  cancelar() {
    this.router.navigate(['/medicamentos']);
  }
}