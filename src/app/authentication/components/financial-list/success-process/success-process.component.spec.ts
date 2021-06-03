import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessProcessComponent } from './success-process.component';

describe('SuccessProcessComponent', () => {
  let component: SuccessProcessComponent;
  let fixture: ComponentFixture<SuccessProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
