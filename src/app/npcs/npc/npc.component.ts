import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NPC } from 'rpg-table-randomizer/src/npc';
import { NPCSchema } from 'rpg-table-randomizer/src/npc_schema.js';
import { appNPCSchema } from '../appnpc';
import { MatDialog } from '@angular/material/dialog';
import { NpcsService } from '../npcs.service';
import { NpcEditModalComponent } from '../npc-edit-modal/npc-edit-modal.component';

@Component({
  selector: 'app-npc',
  templateUrl: './npc.component.html',
  styleUrls: ['./npc.component.css']
})
export class NpcComponent implements OnInit {
  @Input() npc: NPC;
  schema: NPCSchema;

  constructor(private npcsService: NpcsService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.schema = appNPCSchema;
  }

  getNPCName() : string {
    return this.npc.fields.npcName;
  }

  getFieldNames() : Array<string> {
    return Object.keys(this.npc.fields);
  }

  getFieldLabel(fieldName: string) : string {
    const field = this.schema.fields.find((f) => f.key === fieldName);
    return `${field.label}:`;
  }

  editModal() {
    const dialogRef = this.dialog.open(NpcEditModalComponent, {
      data: { npc: this.npc },
      ariaLabelledBy: 'modal-title',
      minWidth: '50vw',
      maxWidth: '90vw',
      minHeight: '400px',
      maxHeight: '90vh'
    });
  }

  deleteNPC() {
    this.npcsService.deleteNPC(this.npc.id);
  }
}
