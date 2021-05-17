import { Component, OnInit, Inject } from '@angular/core';
import { NPC } from 'rpg-table-randomizer/src/npc';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NpcsService } from '../npcs.service';
import { appNPCSchema } from '../appnpc';
import { NPCSchema } from 'rpg-table-randomizer/src/npc_schema.js';

@Component({
  selector: 'app-npc-edit-modal',
  templateUrl: './npc-edit-modal.component.html',
  styleUrls: ['./npc-edit-modal.component.css']
})
export class NpcEditModalComponent implements OnInit {
  npc?: NPC;
  schema: NPCSchema = appNPCSchema;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {npc: NPC}, public dialogRef: MatDialogRef<NpcEditModalComponent>, private npcService: NpcsService) {
    this.npc = data.npc;
  }

  ngOnInit(): void {
  }

  onSubmit($event): void {
    const formData = new FormData($event.target);
    console.log(this.npc);

    const newFields = {};
    formData.forEach((value, key) => {
      newFields[key] = value.toString();
    });

    // Copy all the fields and then assign new values.
    const fields = Object.assign({}, this.npc.fields, newFields);
    this.npcService.updateNPCFields(this.npc.id, fields);
    this.dialogRef.close();
  }

}
