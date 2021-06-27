import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RandomtableService } from '../../tables/randomtable.service';
import { Town, TownSchema } from '../town';
import store from '../../store/store';
import { updateTown } from '../../store/town-reducer';

@Component({
  selector: 'app-town-edit-modal',
  templateUrl: './town-edit-modal.component.html',
  styleUrls: ['./town-edit-modal.component.css']
})
export class TownEditModalComponent implements OnInit {
  town: Town;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { town: Town }, public dialogRef: MatDialogRef<TownEditModalComponent>, private randomTableService: RandomtableService, private el: ElementRef) {
    this.town = data.town;
  }

  ngOnInit(): void {
    console.log(this.town);
  }

  reroll(fieldKey: string, append: Boolean = false) : void {
    // get source from schema
    console.log(`roll ${fieldKey}`);
    const field = this.town.schema.getField(fieldKey);
    if (field === null) {
      console.log('field is invalid');
      return;
    }
    const result = this.randomTableService.convertToken(field.source);
    const input = this.el.nativeElement.querySelector(`#${fieldKey}`);
    if (append) {
      input.value += `\n${result}`;
    } else {
      input.value = result;
    }
  }

  onSubmit($event): void {
    const formData = new FormData($event.target);
    // console.log(this.npc);

    const newFields = {};
    formData.forEach((value, key) => {
      newFields[key] = value.toString();
    });
    // Copy all the fields and then assign new values.
    //const fields = Object.assign({}, this.town.fields, newFields);
    this.town.fields = newFields;
    // if (!this.town.name) {
    //   // 'ERROR!';
    //   return;
    // }
    store.dispatch(updateTown({ town: this.town.toJSON() }));
    this.dialogRef.close();
  }

}
