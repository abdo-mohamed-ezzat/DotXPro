import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemsInventoryPage } from './items-inventory.page';

describe('ItemsInventoryPage', () => {
  let component: ItemsInventoryPage;
  let fixture: ComponentFixture<ItemsInventoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemsInventoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
