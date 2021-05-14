import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import Note from '../notes/note';
import { ModalService } from '../modal.service';
import { NotesService } from '../notes.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-note-edit-modal',
  templateUrl: './note-edit-modal.component.html',
  styleUrls: ['./note-edit-modal.component.css']
})
export class NoteEditModalComponent implements OnInit {
  note?: Note;
  destroy: Function;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {note: Note}, private modalService: ModalService, private el: ElementRef, private notesService: NotesService, public dialogRef: MatDialogRef<NoteEditModalComponent>) {
    this.note = data.note;
  }

  ngOnInit(): void {
    //this.editForm.setValue()
  }

  closeModal() {
    //this.destroy();
  }

  onSubmit($event): void {
    const formData = new FormData($event.target);
    this.note.title = formData.get('title').toString();
    this.note.content = formData.get('content').toString();
    this.notesService.updateNote(this.note);
    this.dialogRef.close();
  }
}
