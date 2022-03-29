import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepetidoraycontactoComponent } from './repetidoraycontacto.component';

describe('RepetidoraycontactoComponent', () => {
  let component: RepetidoraycontactoComponent;
  let fixture: ComponentFixture<RepetidoraycontactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepetidoraycontactoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepetidoraycontactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
