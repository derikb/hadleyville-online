import { Injectable } from '@angular/core';
import { RandomtableService } from './randomtable.service';
import { NPC } from 'rpg-table-randomizer/src/npc';
import { appNPCSchema, createNewNPC } from './npcs/appnpc';
import { Subject } from 'rxjs';
import store from './store/store';
import { createNPC, updateNPCFields, updateNPC, deleteNPC } from './store/npcs-reducer';

@Injectable({
  providedIn: 'root'
})
export class NpcsService {
  npcs: Array<NPC> = [];
  npcs$: Subject<NPC> = new Subject<NPC>();
  deletedNPCs$: Subject<string> = new Subject<string>();

  constructor(private randomtableService: RandomtableService) { }

  getAllNPCs() : Array<NPC> {
    const npcs = store.getState().npcs;
    return npcs.map((obj) => {
      console.log(obj);
      return new NPC(obj)
    });
  }

  createNewNPC() : NPC {
    const npc = createNewNPC(this.randomtableService.randomizer);
    store.dispatch(createNPC({ npc: npc.toJSON() }));
    this.npcs$.next(npc);
    return npc;
  }

  getNPCById(id: string) : NPC|null {
    const npcs = store.getState().npcs;
    const data = npcs.find((npc) => {
      return npc.id === id;
    })
    if (data) {
      return new NPC(data);
    }
    return null;
  }

  updateNPC(npc: NPC) : void {
    store.dispatch(updateNPC({ npc: npc }));
    const upnpc = this.getNPCById(npc.id);
    this.npcs$.next(upnpc);
  }

  updateNPCFields(id: string, fields: Object) : void {
    store.dispatch(updateNPCFields({ id: id, fields: fields }));
    const npc = this.getNPCById(id);
    this.npcs$.next(npc);
  }

  deleteNPC(id: string) {
    console.log('delete npc');
    store.dispatch(deleteNPC({ id }));
    this.deletedNPCs$.next(id);
  }

}
