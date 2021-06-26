import { Component, OnInit } from '@angular/core';
import { NotesService } from '../notes/notes.service';
import { NpcsService } from '../npcs/npcs.service';
import { updateTown } from '../store/town-reducer';
import store from '../store/store';


@Component({
  selector: 'app-importer',
  templateUrl: './importer.component.html',
  styleUrls: ['./importer.component.css']
})
export class ImporterComponent implements OnInit {

  constructor(private notesService: NotesService, private npcsService: NpcsService) { }

  ngOnInit(): void {
  }

  /**
   * Restore Backup form handler
   * @param {SubmitEvent} event
   */
  importFile(event) : void {
    event.preventDefault();
    const form = event.target;
    const input_file = form.querySelector('input[type=file]');
    if (!input_file.files) {
      return;
    }
    Array.from(input_file.files).forEach((f: Blob) => {
      const reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = ((theFile) => {
          return (e) => {
              let data: any = {};
              try {
                data = JSON.parse(e.target.result);

              } catch (err) {
                return;
              }
              const notes = data.notes || [];
              if (notes && Array.isArray(notes) && notes.length > 0) {
                this.notesService.importNotes(notes);
              }
              const npcs = data.npcs || [];
              if (npcs && Array.isArray(npcs) && npcs.length > 0) {
                this.npcsService.importNPCs(npcs);
              }
              const towns = data.town || [];
              if (Array.isArray(towns) ) {
                const town = towns.find(Boolean);
                if (town) {
                  store.dispatch(updateTown({ town }));
                }
              }
          };
      })(f);
      reader.readAsText(f);
    });

    // clear form.
    input_file.value = '';
  }
}
