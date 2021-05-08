import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NPC } from 'rpg-table-randomizer/src/npc';
import { NPCSchema } from 'rpg-table-randomizer/src/npc_schema.js';
import { appNPCSchema } from '../npcs/appnpc';


@Component({
  selector: 'app-npc',
  templateUrl: './npc.component.html',
  styleUrls: ['./npc.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class NpcComponent implements OnInit {
  @Input() npc: NPC;
  schema: NPCSchema;

  constructor() { }

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
}
