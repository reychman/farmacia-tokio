import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentoList } from './medicamento-list';

describe('MedicamentoList', () => {
  let component: MedicamentoList;
  let fixture: ComponentFixture<MedicamentoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentoList],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicamentoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
