import { Component, OnInit, Inject } from '@angular/core';
import { NPC } from 'rpg-table-randomizer/src/npc';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NpcsService } from '../npcs.service';


@Component({
  selector: 'app-npc-edit-modal',
  templateUrl: './npc-edit-modal.component.html',
  styleUrls: ['./npc-edit-modal.component.css']
})
export class NpcEditModalComponent implements OnInit {
  npc?: NPC;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {npc: NPC}, public dialogRef: MatDialogRef<NpcEditModalComponent>, private npcService: NpcsService) {
    this.npc = data.npc;
  }

  ngOnInit(): void {
  }

  onSubmit($event): void {
    const formData = new FormData($event.target);
    console.log(this.npc);

    //this.npc.fields.npcName = formData.get('npcName').toString();
    //this.npcService.updateNPC(this.npc);

    // Copy all the fields and then assign new values.
    const fields = Object.assign({}, this.npc.fields, {
      npcName: formData.get('npcName').toString()
    });
    this.npcService.updateNPCFields(this.npc.id, fields);
    this.dialogRef.close();
  }

}
