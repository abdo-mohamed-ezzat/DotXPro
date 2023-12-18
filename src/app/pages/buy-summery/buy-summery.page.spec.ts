import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuySummeryPage } from './buy-summery.page';

describe('BuySummeryPage', () => {
  let component: BuySummeryPage;
  let fixture: ComponentFixture<BuySummeryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BuySummeryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
