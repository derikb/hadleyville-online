import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RandomtableService } from '../randomtable.service';
import { RandomTable, RandomTableResultSet } from 'rpg-table-randomizer/src/random_table.js';
import { ModalService } from '../modal.service';
import { NotesService } from '../notes.service';
import { NpcsService} from '../npcs.service';
import { ModalComponent } from '../modal/modal.component';
import { ResultsModalComponent } from '../results-modal/results-modal.component';
import Note from '../notes/note';
import { NPC } from 'rpg-table-randomizer/src/npc';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class HomePageComponent implements OnInit {
  tables: Array<RandomTable> = [];
  results: Array<any> = [];
  notes: Array<Note> = [];
  npcs: Array<NPC> = [];

  constructor(private tableService: RandomtableService, private modalService: ModalService, private noteService: NotesService, private npcService: NpcsService) { }

  ngOnInit() {
    this.tables = this.tableService.getAllTables();
    this.npcs = this.npcService.getAllNPCs();

    this.noteService.notes$.subscribe({
      next: (note) => {
        console.log(note);
        this.notes.push(note);
      }
    });
  }

  showResult({ table, resultSet }: { table: RandomTable, resultSet: RandomTableResultSet }) {
    console.log(resultSet);
    this.modalService.open(ResultsModalComponent, { table: table, resultSet: resultSet });
  }

  getNPC() {
    this.npcService.createNewNPC();
  }

  getNPCName() {
    const newName = this.tableService.getNPCName();
    this.modalService.open(ModalComponent, { title: 'A name', content: newName });
  }
}
