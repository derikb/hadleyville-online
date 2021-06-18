import { Component, Input, OnInit, ElementRef } from '@angular/core';
import Note from '../note';
import { NotesService } from '../notes.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  @Input() note: Note|null;
  isEdit: Boolean = false;
  constructor(private notesService: NotesService, private el: ElementRef) { }

  ngOnInit(): void {
    // This will set new empty notes to open/edit mode on first load.
    if (this.note.title === '' && this.note.content === '') {
      this.note.collapse = false;
      this.isEdit = true;
    }
  }

  toggleEdit() {
    this.isEdit = !this.isEdit;
  }

  /**
   * Save collapse state
   * @param ev Toggle event on details.
   */
  setCollapse(ev) {
    const newState = !ev.target.open;
    if (this.note.collapse === newState) {
      return;
    }
    this.note.collapse = newState;
    this.notesService.updateNote(this.note);
  }

  saveEdit(ev) {
    const formData = new FormData(ev.target);
    this.note.title = formData.get('title').toString();
    this.note.content = formData.get('content').toString();
    this.notesService.updateNote(this.note);
    this.isEdit = false;
  }

  deleteNote() {
    this.notesService.deleteNote(this.note.id);
  }
}
