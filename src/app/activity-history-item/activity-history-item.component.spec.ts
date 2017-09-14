import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityHistoryItemComponent } from './activity-history-item.component';

describe('ActivityHistoryItemComponent', () => {
  let component: ActivityHistoryItemComponent;
  let fixture: ComponentFixture<ActivityHistoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityHistoryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
