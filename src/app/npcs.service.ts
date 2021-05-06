import { Injectable } from '@angular/core';
import { RandomtableService } from './randomtable.service';
import { NPC } from 'rpg-table-randomizer/src/npc';
import { appNPCSchema, createNewNPC } from './npcs/appnpc';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NpcsService {
  npcs: Array<NPC> = [];
  npcs$: Subject<NPC> = new Subject<NPC>();

  constructor(private randomtableService: RandomtableService) { }

  getAllNPCs() : Array<NPC> {
    return this.npcs;
  }

  createNewNPC() : NPC {
    const npc = createNewNPC(this.randomtableService.randomizer);
    console.log(npc);
    this.npcs.push(npc);
    this.npcs$.next(npc);
    return npc;
  }

  getNPCById(id: string) : NPC|null {
    const npc = this.npcs.filter((npc) => {
      return npc.id === id;
    })
    return npc || null;
  }


}
