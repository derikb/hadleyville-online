import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcEditModalComponent } from './npc-edit-modal.component';

describe('NpcEditModalComponent', () => {
  let component: NpcEditModalComponent;
  let fixture: ComponentFixture<NpcEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpcEditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NpcEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
