import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrialBalancePage } from './trial-balance.page';

describe('TrialBalancePage', () => {
  let component: TrialBalancePage;
  let fixture: ComponentFixture<TrialBalancePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TrialBalancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
