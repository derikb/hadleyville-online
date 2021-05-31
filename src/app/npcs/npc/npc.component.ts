import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { NPC } from 'rpg-table-randomizer/src/npc';
import { NPCSchema } from 'rpg-table-randomizer/src/npc_schema.js';
import { appNPCSchema } from '../appnpc';
import { NpcsService } from '../npcs.service';
import { RandomtableService } from '../../tables/randomtable.service';


@Component({
  selector: 'app-npc',
  templateUrl: './npc.component.html',
  styleUrls: ['./npc.component.css']
})
export class NpcComponent implements OnInit {
  @Input() npc: NPC;
  schema: NPCSchema;
  isEdit: Boolean = false;

  constructor(private npcsService: NpcsService, private randomTableService: RandomtableService, private el: ElementRef) { }

  ngOnInit(): void {
    this.schema = appNPCSchema;
  }

  toggleEdit() {
    this.isEdit = !this.isEdit;
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

  saveNPC($event): void {
    const formData = new FormData($event.target);
    console.log(this.npc);

    const newFields = {};
    formData.forEach((value, key) => {
      newFields[key] = value.toString();
    });

    // Copy all the fields and then assign new values.
    const fields = Object.assign({}, this.npc.fields, newFields);
    this.npcsService.updateNPCFields(this.npc.id, fields);
    this.isEdit = false;
  }

  reroll(fieldKey: string) : void {
    // get source from schema
    const field = this.schema.fields.find((f) => f.key === fieldKey);
    const result = this.randomTableService.convertToken(field.source);
    console.log(result);
    const input = this.el.nativeElement.querySelector(`#${fieldKey}`);
    input.value = result;
  }

  deleteNPC() {
    this.npcsService.deleteNPC(this.npc.id);
  }
}
