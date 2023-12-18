import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BalanceSheetPage } from './balance-sheet.page';

describe('BalanceSheetPage', () => {
  let component: BalanceSheetPage;
  let fixture: ComponentFixture<BalanceSheetPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BalanceSheetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
