import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { VentaService, Venta } from '../../../core/services/venta';

@Component({
  selector: 'app-venta-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './venta-list.html',
})
export class VentaListComponent implements OnInit, OnDestroy {
  ventas: Venta[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private ventaService: VentaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargar();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(async () => {
        await this.cargar();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async cargar() {
    this.ventas = (await this.ventaService.listar()).reverse();
    console.log('📋 Ventas cargadas:', this.ventas.length);
    this.cdr.detectChanges();
  }

  async eliminar(id: number) {
    if (!confirm('¿Anular esta venta? El stock NO se restaurará automáticamente.')) return;
    await this.ventaService.eliminar(id);
    await this.cargar();
  }

  formatFecha(iso: string) {
    return new Date(iso).toLocaleString('es-BO');
  }
}