import { Component, OnInit } from '@angular/core';
import store from '../../store/store';
import { updateTown } from '../../store/town-reducer';
import { Town, TownSchema } from '../town';
import { MatDialog } from '@angular/material/dialog';
import { TownEditModalComponent } from '../town-edit-modal/town-edit-modal.component';

@Component({
  selector: 'app-town',
  templateUrl: './town.component.html',
  styleUrls: ['./town.component.css']
})
export class TownComponent implements OnInit {
  town: Town;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    const data = store.getState().town[0] || {};
    this.town = new Town(data);
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
