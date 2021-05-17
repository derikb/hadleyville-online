import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMultiComponent } from './table-multi.component';

describe('TableMultiComponent', () => {
  let component: TableMultiComponent;
  let fixture: ComponentFixture<TableMultiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableMultiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
