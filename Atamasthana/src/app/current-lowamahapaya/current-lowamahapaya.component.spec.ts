import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentLowamahapayaComponent } from './current-lowamahapaya.component';

describe('CurrentLowamahapayaComponent', () => {
  let component: CurrentLowamahapayaComponent;
  let fixture: ComponentFixture<CurrentLowamahapayaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentLowamahapayaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentLowamahapayaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
