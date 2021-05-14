import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import Note from '../notes/note';
import { ModalService } from '../modal.service';
import { NoteEditModalComponent } from '../note-edit-modal/note-edit-modal.component';
import { NotesService } from '../notes.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  @Input() note: Note|null;
  constructor(private modalService: ModalService, private notesService: NotesService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }


  editModal() {
    const dialogRef = this.dialog.open(NoteEditModalComponent, {
      data: { note: this.note },
      ariaLabelledBy: 'modal-title',
      minWidth: '50vw',
      maxWidth: '90vw',
      minHeight: '400px',
      maxHeight: '90vh'
    });
    console.log('click');
    //this.modalService.open(NoteEditModalComponent, { note: this.note });
  }

  deleteNote() {
    this.notesService.deleteNote(this.note.id);
  }

}
