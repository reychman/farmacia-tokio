import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-venta-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './venta-list.html',
  styleUrl: './venta-list.css'
})
export class VentaListComponent implements OnInit {
  ventas: any[] = [];

  ngOnInit() {
    this.ventas = [
      { id: 'V001', fecha: new Date(), items: [{}, {}], total: 85 },
      { id: 'V002', fecha: new Date(), items: [{}], total: 120 },
      { id: 'V003', fecha: new Date(), items: [{}, {}, {}], total: 45 },
    ];
  }
}