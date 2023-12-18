import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesProfitPage } from './sales-profit.page';

describe('SalesProfitPage', () => {
  let component: SalesProfitPage;
  let fixture: ComponentFixture<SalesProfitPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SalesProfitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
