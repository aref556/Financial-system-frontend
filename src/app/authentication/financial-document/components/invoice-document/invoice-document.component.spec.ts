import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDocumentComponent } from './invoice-document.component';

describe('InvoiceDocumentComponent', () => {
  let component: InvoiceDocumentComponent;
  let fixture: ComponentFixture<InvoiceDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
