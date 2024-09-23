import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BsFiveSceneComponent } from './bs-five-scene.component';

describe('BsFiveSceneComponent', () => {
  let component: BsFiveSceneComponent;
  let fixture: ComponentFixture<BsFiveSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BsFiveSceneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BsFiveSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
