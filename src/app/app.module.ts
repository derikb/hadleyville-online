import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';

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
import { NotesListComponent } from './notes/notes-list/notes-list.component';
import { NpcsListComponent } from './npcs/npcs-list/npcs-list.component';
import { TablesListComponent } from './tables/tables-list/tables-list.component';
import { TownComponent } from './towns/town/town.component';
import { TownEditModalComponent } from './towns/town-edit-modal/town-edit-modal.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { ExporterComponent } from './exporter/exporter.component';
import { ImporterComponent } from './importer/importer.component';

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
    NotesListComponent,
    NpcsListComponent,
    TablesListComponent,
    TownComponent,
    TownEditModalComponent,
    SettingsPageComponent,
    ExporterComponent,
    ImporterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
