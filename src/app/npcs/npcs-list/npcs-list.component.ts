import { Component, OnInit } from '@angular/core';
import { NpcsService} from '../npcs.service';
import { NPC } from 'rpg-table-randomizer/src/npc';

@Component({
  selector: 'app-npcs-list',
  templateUrl: './npcs-list.component.html',
  styleUrls: ['./npcs-list.component.css']
})
export class NpcsListComponent implements OnInit {
  npcs: Array<NPC> = [];

  constructor(private npcService: NpcsService) { }

  ngOnInit(): void {
    this.npcs = this.npcService.getAllNPCs();

    this.npcService.npcs$.subscribe({
      next: (npc) => {
        console.log(npc);
        const index = this.npcs.findIndex((el) => el.id === npc.id);
        if (index === -1) {
          this.npcs.push(npc);
        } else {
          this.npcs.splice(index, 1, npc);
        }
      }
    });

    this.npcService.deletedNPCs$.subscribe({
      next: (id) => {
        const index = this.npcs.findIndex((el) => el.id === id);
        if (index > -1) {
          this.npcs.splice(index, 1);
        }
      }
    });
  }

  getNPC() {
    this.npcService.createNewNPC();
  }

  getNPCName() {
    //const newName = this.tableService.getNPCName();
    //this.modalService.open(ModalComponent, { title: 'A name', content: newName });
  }

}
