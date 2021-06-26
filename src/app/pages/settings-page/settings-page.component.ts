import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../notes/notes.service';
import { NpcsService } from '../../npcs/npcs.service';
import { clearTown } from '../../store/town-reducer';
import store from '../../store/store';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {

  constructor(private notesService: NotesService, private npcsService: NpcsService) { }

  ngOnInit(): void {
  }

  deleteData(event) : void {
    if (!confirm('Are you sure?')) {
      return;
    }
    console.log('DELETE');
    this.notesService.deleteAllNotes();
    this.npcsService.deleteAllNPCs();
    store.dispatch(clearTown());
  }
}
