import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaServicioComponent } from './vista-servicio.component';

describe('VistaServicioComponent', () => {
  let component: VistaServicioComponent;
  let fixture: ComponentFixture<VistaServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaServicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
