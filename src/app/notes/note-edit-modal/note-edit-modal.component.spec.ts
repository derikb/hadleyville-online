import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteEditModalComponent } from './note-edit-modal.component';

describe('NoteEditModalComponent', () => {
  let component: NoteEditModalComponent;
  let fixture: ComponentFixture<NoteEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteEditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
