import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  totalMedicamentos = 0;
  ventasHoy = 0;
  stockBajo = 0;
  totalHoy = 0;
  medicamentosBajoStock: any[] = [];
  ultimasVentas: any[] = [];

  ngOnInit() {
    // Aquí conectarás con los servicios IndexedDB
    // Por ahora datos de prueba
    this.totalMedicamentos = 24;
    this.ventasHoy = 8;
    this.stockBajo = 3;
    this.totalHoy = 450;
    this.medicamentosBajoStock = [
      { id: 1, nombre: 'Paracetamol 500mg', stock: 2 },
      { id: 2, nombre: 'Ibuprofeno 400mg', stock: 4 },
      { id: 3, nombre: 'Amoxicilina 500mg', stock: 1 },
    ];
    this.ultimasVentas = [
      { id: 'V001', fecha: new Date(), total: 85 },
      { id: 'V002', fecha: new Date(), total: 120 },
      { id: 'V003', fecha: new Date(), total: 45 },
    ];
  }
}