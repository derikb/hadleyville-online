import { Injectable } from '@angular/core';
import { RandomtableService } from '../tables/randomtable.service';
import { createNewNPC, NPC } from './appnpc';
import { Subject } from 'rxjs';
import store from '../store/store';
import { createNPC, updateNPC, deleteNPC, sortNPCs } from '../store/npcs-reducer';

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
      return new NPC(obj)
    });
  }

  createNewNPC() : NPC {
    const npc = createNewNPC(this.randomtableService.randomizer);
    store.dispatch(createNPC({ npc: npc.toJSON() }));
    this.npcs$.next(npc);
    return npc;
  }

  getNPCById(uuid: string) : NPC|null {
    const npcs = store.getState().npcs;
    const data = npcs.find((npc) => {
      return npc.uuid === uuid;
    })
    if (data) {
      return new NPC(data);
    }
    return null;
  }

  updateNPC(npc: NPC) : void {
    store.dispatch(updateNPC({ npc: npc.toJSON() }));
    const upnpc = this.getNPCById(npc.uuid);
    this.npcs$.next(upnpc);
  }

  deleteNPC(uuid: string) {
    store.dispatch(deleteNPC({ uuid }));
    this.deletedNPCs$.next(uuid);
  }

  sortNPCs(sortUuids: Array<string>) {
    store.dispatch(sortNPCs({ sortUuids }));
  }
}
