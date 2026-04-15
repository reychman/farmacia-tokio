import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentoFormComponent } from './medicamento-form';

describe('MedicamentoFormComponent', () => {
  let component: MedicamentoFormComponent;
  let fixture: ComponentFixture<MedicamentoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentoFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicamentoFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
