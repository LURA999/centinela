import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRedComponent } from './dashboard-red.component';

describe('DashboardRedComponent', () => {
  let component: DashboardRedComponent;
  let fixture: ComponentFixture<DashboardRedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardRedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
