import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationReportSettingComponent } from './location-report-setting.component';

describe('LocationReportSettingComponent', () => {
  let component: LocationReportSettingComponent;
  let fixture: ComponentFixture<LocationReportSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationReportSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationReportSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
