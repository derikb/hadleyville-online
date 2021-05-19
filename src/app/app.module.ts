import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableResultComponent } from './tables/table-result/table-result.component';
import { TableMultiComponent } from './tables/table-multi/table-multi.component';
import { ResultsModalComponent } from './tables/results-modal/results-modal.component';
import { NoteComponent } from './notes/note/note.component';
import { NpcComponent } from './npcs/npc/npc.component';
import { RulesPageComponent } from './pages/rules-page/rules-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { IntroPageComponent } from './pages/intro-page/intro-page.component';
import { RollerComponent } from './roller/roller.component';
import { NoteEditModalComponent } from './notes/note-edit-modal/note-edit-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { NpcEditModalComponent } from './npcs/npc-edit-modal/npc-edit-modal.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NotesListComponent } from './notes/notes-list/notes-list.component';
import { NpcsListComponent } from './npcs/npcs-list/npcs-list.component';
import { TablesListComponent } from './tables/tables-list/tables-list.component';
import { TownComponent } from './towns/town/town.component';

@NgModule({
  declarations: [
    AppComponent,
    TableResultComponent,
    TableMultiComponent,
    ResultsModalComponent,
    NoteComponent,
    NpcComponent,
    RulesPageComponent,
    HomePageComponent,
    IntroPageComponent,
    RollerComponent,
    NoteEditModalComponent,
    NpcEditModalComponent,
    NotesListComponent,
    NpcsListComponent,
    TablesListComponent,
    TownComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatExpansionModule,
    MatSelectModule,
    MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
