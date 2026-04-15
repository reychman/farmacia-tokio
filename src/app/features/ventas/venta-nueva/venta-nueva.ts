import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-venta-nueva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venta-nueva.html',
  styleUrl: './venta-nueva.css'
})
export class VentaNuevaComponent implements OnInit {
  busqueda = '';
  medicamentos: any[] = [];
  medicamentosFiltrados: any[] = [];
  carrito: any[] = [];
  total = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.medicamentos = [
      { id: 1, nombre: 'Paracetamol 500mg', precio: 5, stock: 10 },
      { id: 2, nombre: 'Ibuprofeno 400mg', precio: 8, stock: 15 },
      { id: 3, nombre: 'Amoxicilina 500mg', precio: 12, stock: 4 },
      { id: 4, nombre: 'Omeprazol 20mg', precio: 7, stock: 20 },
    ];
    this.medicamentosFiltrados = [...this.medicamentos];
  }

  filtrar() {
    const texto = this.busqueda.toLowerCase();
    this.medicamentosFiltrados = this.medicamentos.filter(m =>
      m.nombre.toLowerCase().includes(texto)
    );
  }

  agregarAlCarrito(med: any) {
    const existe = this.carrito.find(i => i.id === med.id);
    if (existe) {
      if (existe.cantidad < med.stock) existe.cantidad++;
    } else {
      this.carrito.push({ ...med, cantidad: 1, stockMax: med.stock });
    }
    this.recalcular();
  }

  quitarDelCarrito(id: number) {
    this.carrito = this.carrito.filter(i => i.id !== id);
    this.recalcular();
  }

  recalcular() {
    this.total = this.carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  }

  confirmarVenta() {
    if (this.carrito.length === 0) return;
    // Aquí guardarás en IndexedDB
    alert('Venta registrada correctamente');
    this.router.navigate(['/ventas']);
  }
}