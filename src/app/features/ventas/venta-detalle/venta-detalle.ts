import { Component, OnInit } from '@angular/core';
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
    private medService: MedicamentoService
  ) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.venta = await this.ventaService.obtener(id);
    const detallesRaw = await this.ventaService.obtenerDetalle(id);
    const meds = await this.medService.listar();

    this.detalles = detallesRaw.map(d => ({
      ...d,
      nombreMedicamento:
        meds.find(m => m.id === d.medicamentoId)?.nombre ?? 'Desconocido',
    }));
  }

  formatFecha(iso: string) {
    return new Date(iso).toLocaleString('es-BO');
  }
}