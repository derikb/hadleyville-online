import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import Note from '../notes/note';
import { ModalService } from '../modal.service';
import { NoteEditModalComponent } from '../note-edit-modal/note-edit-modal.component';
import { NotesService } from '../notes.service';


@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class NoteComponent implements OnInit {
  @Input() note: Note|null;
  constructor(private modalService: ModalService, private notesService: NotesService) { }

  ngOnInit(): void {
  }


  editModal() {
    console.log('click');
    this.modalService.open(NoteEditModalComponent, { note: this.note });
  }

  deleteNote() {
    this.notesService.deleteNote(this.note.id);
  }

}
