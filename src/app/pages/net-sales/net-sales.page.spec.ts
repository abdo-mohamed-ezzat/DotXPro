import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetSalesPage } from './net-sales.page';

describe('NetSalesPage', () => {
  let component: NetSalesPage;
  let fixture: ComponentFixture<NetSalesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NetSalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
