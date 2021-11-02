import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NpcsService} from '../npcs.service';
import { NPC } from '../appnpc';
import { NpcComponent } from '../npc/npc.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-npcs-list',
  templateUrl: './npcs-list.component.html',
  styleUrls: ['./npcs-list.component.css']
})
export class NpcsListComponent implements OnInit {
  npcs: Array<NPC> = [];
  @ViewChildren(NpcComponent) npcElements!: QueryList<NpcComponent>;

  constructor(private npcService: NpcsService) { }

  ngOnInit(): void {
    this.npcs = this.npcService.getAllNPCs();

    this.npcService.npcs$.subscribe({
      next: (npc) => {
        const index = this.npcs.findIndex((el) => el.uuid === npc.uuid);
        if (index === -1) {
          this.npcs.push(npc);
        } else {
          this.npcs.splice(index, 1, npc);
        }
      }
    });

    this.npcService.deletedNPCs$.subscribe({
      next: (uuid) => {
        const index = this.npcs.findIndex((el) => el.uuid === uuid);
        if (index > -1) {
          this.npcs.splice(index, 1);
        }
      }
    });
  }

  /**
   * Collapse all NPCs components.
   */
  collapseAll() {
    this.npcElements.forEach((npc) => {
      npc.collapse();
    })
  }

  createNPC() {
    this.npcService.createNewNPC();
  }
  /**
   * Reorder on drag/drop.
   * @param event Drop event.
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.npcs, event.previousIndex, event.currentIndex);
    this.npcService.sortNPCs(this.npcs.map((npc) => { return npc.uuid }));
  }
}
