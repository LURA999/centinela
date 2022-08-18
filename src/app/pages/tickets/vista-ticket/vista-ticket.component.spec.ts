import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaTicketComponent } from './vista-ticket.component';

describe('VistaTicketComponent', () => {
  let component: VistaTicketComponent;
  let fixture: ComponentFixture<VistaTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
