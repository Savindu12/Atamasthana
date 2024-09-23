import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeapViewerComponent } from './leap-viewer.component';

describe('LeapViewerComponent', () => {
  let component: LeapViewerComponent;
  let fixture: ComponentFixture<LeapViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeapViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeapViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
