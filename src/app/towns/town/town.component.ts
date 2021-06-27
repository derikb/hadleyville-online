import { Component, OnInit } from '@angular/core';
import store from '../../store/store';
import { updateTown } from '../../store/town-reducer';
import { Town, TownSchema } from '../town';
import { MatDialog } from '@angular/material/dialog';
import { TownEditModalComponent } from '../town-edit-modal/town-edit-modal.component';
import { RandomtableService } from '../../tables/randomtable.service';

@Component({
  selector: 'app-town',
  templateUrl: './town.component.html',
  styleUrls: ['./town.component.css']
})
export class TownComponent implements OnInit {
  town: Town;

  constructor(private randomTableService: RandomtableService, public dialog: MatDialog) { }

  ngOnInit(): void {
    const data = store.getState().town[0] || {};
    if (!data.uuid) {
      // Always have a town in the UI.
      this.generateNewTown();
      return;
    }
    this.town = new Town(data);
  }

  generateNewTown() {
    this.town = new Town({});
    this.town.schema.fields.forEach((field) => {
      const result = this.randomTableService.convertToken(field.source);
      this.town.fields[field.key] = result;
    });
    store.dispatch(updateTown({ town: this.town.toJSON() }));
  }

  editModal() {
    const dialogRef = this.dialog.open(TownEditModalComponent, {
      data: { town: this.town },
      ariaLabelledBy: 'modal-title',
      minWidth: '50vw',
      maxWidth: '90vw',
      maxHeight: '90vh'
    });
  }
}
