import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NPC } from 'rpg-table-randomizer/src/npc';


@Component({
  selector: 'app-npc',
  templateUrl: './npc.component.html',
  styleUrls: ['./npc.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class NpcComponent implements OnInit {
  @Input() npc: NPC;
  constructor() { }

  ngOnInit(): void {
  }

  getFieldNames() : Array<string> {
    return Object.keys(this.npc.fields);
  }

}
