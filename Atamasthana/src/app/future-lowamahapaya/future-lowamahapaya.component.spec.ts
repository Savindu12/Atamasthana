import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureLowamahapayaComponent } from './future-lowamahapaya.component';

describe('FutureLowamahapayaComponent', () => {
  let component: FutureLowamahapayaComponent;
  let fixture: ComponentFixture<FutureLowamahapayaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FutureLowamahapayaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FutureLowamahapayaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
