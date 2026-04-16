import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MedicamentoService } from '../../core/services/medicamento';
import { VentaService, Venta } from '../../core/services/venta';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit, OnDestroy {
  totalMedicamentos = 0;
  stockBajo: any[] = [];
  ventasHoy = 0;
  totalHoy = 0;
  ventasRecientes: Venta[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private medService: MedicamentoService,
    private ventaService: VentaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargarDatos();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.cargarDatos();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async cargarDatos() {
    try {
      const meds = await this.medService.listar();
      console.log('📊 Dashboard - Medicamentos cargados:', meds);
      this.totalMedicamentos = meds.length;
      this.stockBajo = meds.filter(m => m.stock <= 5);

      const hoy = new Date().toISOString().split('T')[0];
      const ventas = await this.ventaService.listar();
      const ventasDeHoy = ventas.filter(v => v.fecha.startsWith(hoy));

      this.ventasHoy = ventasDeHoy.length;
      this.totalHoy = ventasDeHoy.reduce((acc, v) => acc + v.total, 0);
      this.ventasRecientes = [...ventas]
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 5);
      console.log('📊 Dashboard actualizado - Total meds:', this.totalMedicamentos, 'Ventas hoy:', this.ventasHoy);
      
      // Forzar detección de cambios para actualizar la UI
      this.cdr.detectChanges();
    } catch (err) {
      console.error('❌ Error cargando dashboard:', err);
    }
  }
}