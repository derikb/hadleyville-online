import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import Note from '../notes/note';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class NoteComponent implements OnInit {
  @Input() note: Note|null;
  constructor() { }

  ngOnInit(): void {
  }

}
