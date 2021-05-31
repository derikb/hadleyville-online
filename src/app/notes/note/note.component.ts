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
  }

  toggleEdit() {
    this.isEdit = !this.isEdit;
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
