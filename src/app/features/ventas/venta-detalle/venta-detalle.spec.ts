import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaDetalleComponent } from './venta-detalle';

describe('VentaDetalleComponent', () => {
  let component: VentaDetalleComponent;
  let fixture: ComponentFixture<VentaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentaDetalleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VentaDetalleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
