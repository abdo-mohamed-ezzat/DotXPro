import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VirtualSCrollingTableComponent } from './virtual-scrolling-table.component';

describe('VirtualSCrollingTableComponent', () => {
  let component: VirtualSCrollingTableComponent;
  let fixture: ComponentFixture<VirtualSCrollingTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualSCrollingTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VirtualSCrollingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
