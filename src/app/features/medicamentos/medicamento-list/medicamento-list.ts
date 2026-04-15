import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medicamento-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe],
  templateUrl: './medicamento-list.html',
  styleUrl: './medicamento-list.css'
})
export class MedicamentoListComponent implements OnInit {
  busqueda = '';
  medicamentos: any[] = [];
  medicamentosFiltrados: any[] = [];

  ngOnInit() {
    // Datos de prueba — luego conectas con IndexedDB
    this.medicamentos = [
      { id: 1, nombre: 'Paracetamol 500mg', categoria: 'Analgésico', precio: 5, stock: 2, vencimiento: new Date('2025-12-01') },
      { id: 2, nombre: 'Ibuprofeno 400mg', categoria: 'Antiinflamatorio', precio: 8, stock: 15, vencimiento: new Date('2026-06-01') },
      { id: 3, nombre: 'Amoxicilina 500mg', categoria: 'Antibiótico', precio: 12, stock: 4, vencimiento: new Date('2025-08-01') },
      { id: 4, nombre: 'Omeprazol 20mg', categoria: 'Gastroprotector', precio: 7, stock: 20, vencimiento: new Date('2026-03-01') },
    ];
    this.medicamentosFiltrados = [...this.medicamentos];
  }

  filtrar() {
    const texto = this.busqueda.toLowerCase();
    this.medicamentosFiltrados = this.medicamentos.filter(m =>
      m.nombre.toLowerCase().includes(texto)
    );
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este medicamento?')) {
      this.medicamentos = this.medicamentos.filter(m => m.id !== id);
      this.filtrar();
    }
  }
}