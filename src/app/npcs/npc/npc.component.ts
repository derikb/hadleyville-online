import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { NPCSchema } from 'rpg-table-randomizer/src/npc_schema.js';
import { appNPCSchema, NPC } from '../appnpc';
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

  /**
   * Save collapse state
   * @param ev Toggle event on details.
   */
   setCollapse(ev) {
    const newState = !ev.target.open;
    if (this.npc.collapse === newState) {
      return;
    }
    this.npc.collapse = newState;
    this.npcsService.updateNPC(this.npc);
  }

  getFieldLabel(fieldName: string) : string {
    const field = this.schema.fields.find((f) => f.key === fieldName);
    return `${field.label}:`;
  }

  saveNPC($event): void {
    const formData = new FormData($event.target);
    formData.forEach((value, key) => {
      this.npc[key] = value.toString();
    });
    this.npcsService.updateNPC(this.npc);
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
    this.npcsService.deleteNPC(this.npc.uuid);
  }
}
