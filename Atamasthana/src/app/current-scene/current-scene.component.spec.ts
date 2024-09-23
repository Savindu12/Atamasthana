import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSceneComponent } from './current-scene.component';

describe('CurrentSceneComponent', () => {
  let component: CurrentSceneComponent;
  let fixture: ComponentFixture<CurrentSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentSceneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
