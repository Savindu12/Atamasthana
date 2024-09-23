import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KalinghaMaghaLowamahapayaComponent } from './kalingha-magha-lowamahapaya.component';

describe('KalinghaMaghaLowamahapayaComponent', () => {
  let component: KalinghaMaghaLowamahapayaComponent;
  let fixture: ComponentFixture<KalinghaMaghaLowamahapayaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KalinghaMaghaLowamahapayaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KalinghaMaghaLowamahapayaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
