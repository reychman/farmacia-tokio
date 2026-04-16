import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MedicamentoService, Medicamento } from '../../../core/services/medicamento';

@Component({
  selector: 'app-medicamento-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './medicamento-list.html',
})
export class MedicamentoListComponent implements OnInit, OnDestroy {
  medicamentos: Medicamento[] = [];
  busqueda = '';
  private destroy$ = new Subject<void>();

  constructor(
    private medService: MedicamentoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargar();
    // Recargar medicamentos cada vez que se navega a esta ruta
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
    this.medicamentos = await this.medService.listar();
    console.log('✅ Medicamentos cargados:', this.medicamentos.length);
    this.cdr.detectChanges();
  }

  get medicamentosFiltrados() {
    if (!this.busqueda.trim()) return this.medicamentos;
    const q = this.busqueda.toLowerCase();
    return this.medicamentos.filter(
      m => m.nombre.toLowerCase().includes(q) || m.laboratorio.toLowerCase().includes(q)
    );
  }

  async eliminar(id: number | undefined) {
    if (!id || !confirm('¿Eliminar este medicamento?')) return;
    await this.medService.eliminar(id);
    await this.cargar();
  }
}