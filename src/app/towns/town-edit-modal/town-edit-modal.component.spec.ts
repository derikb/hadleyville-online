import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TownEditModalComponent } from './town-edit-modal.component';

describe('TownEditModalComponent', () => {
  let component: TownEditModalComponent;
  let fixture: ComponentFixture<TownEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TownEditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TownEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
