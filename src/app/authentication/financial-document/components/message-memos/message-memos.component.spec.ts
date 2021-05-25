import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageMemosComponent } from './message-memos.component';

describe('MessageMemosComponent', () => {
  let component: MessageMemosComponent;
  let fixture: ComponentFixture<MessageMemosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageMemosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageMemosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
