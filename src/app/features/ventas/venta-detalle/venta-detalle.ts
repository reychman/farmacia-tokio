import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VentaService, Venta, DetalleVenta } from '../../../core/services/venta';
import { MedicamentoService } from '../../../core/services/medicamento';

@Component({
  selector: 'app-venta-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './venta-detalle.html',
})
export class VentaDetalleComponent implements OnInit {
  venta: Venta | null = null;
  detalles: (DetalleVenta & { nombreMedicamento: string })[] = [];

  constructor(
    private route: ActivatedRoute,
    private ventaService: VentaService,
    private medService: MedicamentoService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);
    console.log('🔎 Venta detalle id:', idParam, id);
    if (!id || isNaN(id)) {
      console.warn('ID de venta inválido:', idParam);
      this.venta = null;
      return;
    }

    try {
      this.venta = await this.ventaService.obtener(id);
      console.log('📦 Venta obtenida:', this.venta, 'truthy?', !!this.venta);
      if (!this.venta) {
        this.detalles = [];
        this.cdr.detectChanges();
        return;
      }

      const detallesRaw = await this.ventaService.obtenerDetalle(id);
      console.log('📦 Detalles obtenidos:', detallesRaw.length, detallesRaw);
      const meds = await this.medService.listar();

      this.detalles = detallesRaw.map(d => ({
        ...d,
        nombreMedicamento:
          meds.find(m => m.id === d.medicamentoId)?.nombre ?? 'Desconocido',
      }));
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error cargando detalle de venta:', error);
      this.venta = null;
      this.detalles = [];
      this.cdr.detectChanges();
    }
  }

  formatFecha(iso: string) {
    return new Date(iso).toLocaleString('es-BO');
  }
}