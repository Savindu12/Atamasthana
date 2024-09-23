import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldTempleInsideSceneComponent } from './old-temple-inside-scene.component';

describe('OldTempleInsideSceneComponent', () => {
  let component: OldTempleInsideSceneComponent;
  let fixture: ComponentFixture<OldTempleInsideSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldTempleInsideSceneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldTempleInsideSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
