import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaNuevaComponent } from './venta-nueva';

describe('VentaNuevaComponent', () => {
  let component: VentaNuevaComponent;
  let fixture: ComponentFixture<VentaNuevaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentaNuevaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VentaNuevaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
