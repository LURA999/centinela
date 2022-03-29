import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepetidoraComponent } from './repetidora.component';

describe('RepetidoraComponent', () => {
  let component: RepetidoraComponent;
  let fixture: ComponentFixture<RepetidoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepetidoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepetidoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
