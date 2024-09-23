import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempleInsideSceneComponent } from './temple-inside-scene.component';

describe('TempleInsideSceneComponent', () => {
  let component: TempleInsideSceneComponent;
  let fixture: ComponentFixture<TempleInsideSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TempleInsideSceneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempleInsideSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
