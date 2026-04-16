import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MedicamentoService, Medicamento } from '../../../core/services/medicamento';

@Component({
  selector: 'app-medicamento-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './medicamento-list.html',
})
export class MedicamentoListComponent implements OnInit {
  medicamentos: Medicamento[] = [];
  medicamentoSeleccionado: Medicamento | null = null;
  mostrarFormulario = false;
  busqueda = '';

  constructor(private medService: MedicamentoService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.medicamentos = await this.medService.listar();
  }

  get medicamentosFiltrados() {
    if (!this.busqueda.trim()) return this.medicamentos;
    const q = this.busqueda.toLowerCase();
    return this.medicamentos.filter(
      m => m.nombre.toLowerCase().includes(q) || m.laboratorio.toLowerCase().includes(q)
    );
  }

  nuevo() {
    this.medicamentoSeleccionado = null;
    this.mostrarFormulario = true;
  }

  editar(med: Medicamento) {
    this.medicamentoSeleccionado = { ...med };
    this.mostrarFormulario = true;
  }

  async eliminar(id: number | undefined) {
    if (!id || !confirm('¿Eliminar este medicamento?')) return;
    await this.medService.eliminar(id);
    await this.cargar();
  }

  async onGuardado() {
    this.mostrarFormulario = false;
    this.medicamentoSeleccionado = null;
    await this.cargar();
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.medicamentoSeleccionado = null;
  }
}