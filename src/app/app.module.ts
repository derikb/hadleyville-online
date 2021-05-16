import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableListComponent } from './table-list/table-list.component';
import { TableResultComponent } from './table-result/table-result.component';
import { TableMultiComponent } from './table-multi/table-multi.component';
import { ModalComponent } from './modal/modal.component';
import { ModalContainerComponent } from './modalcontainer/modalcontainer.component';
import { ResultsModalComponent } from './results-modal/results-modal.component';
import { NoteComponent } from './note/note.component';
import { NpcComponent } from './npc/npc.component';
import { RulesPageComponent } from './rules-page/rules-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { IntroPageComponent } from './intro-page/intro-page.component';
import { RollerComponent } from './roller/roller.component';
import { NoteEditModalComponent } from './note-edit-modal/note-edit-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { NpcEditModalComponent } from './npc-edit-modal/npc-edit-modal.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    TableListComponent,
    TableResultComponent,
    TableMultiComponent,
    ModalComponent,
    ModalContainerComponent,
    ResultsModalComponent,
    NoteComponent,
    NpcComponent,
    RulesPageComponent,
    HomePageComponent,
    IntroPageComponent,
    RollerComponent,
    NoteEditModalComponent,
    NpcEditModalComponent
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
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
