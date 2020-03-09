import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraFilterComponent } from './camera-filter.component';

describe('CameraFilterComponent', () => {
  let component: CameraFilterComponent;
  let fixture: ComponentFixture<CameraFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
