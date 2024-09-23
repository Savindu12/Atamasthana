import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldLowamahapayaComponent } from './old-lowamahapaya.component';

describe('OldLowamahapayaComponent', () => {
  let component: OldLowamahapayaComponent;
  let fixture: ComponentFixture<OldLowamahapayaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldLowamahapayaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldLowamahapayaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
