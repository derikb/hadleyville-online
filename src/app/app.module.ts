import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableListComponent } from './table-list/table-list.component';
import { TableResultComponent } from './table-result/table-result.component';
import { TableMultiComponent } from './table-multi/table-multi.component';
import { ModalComponent } from './modal/modal.component';
import { ModalContainerComponent } from './modalcontainer/modalcontainer.component';
import { ResultsModalComponent } from './results-modal/results-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    TableListComponent,
    TableResultComponent,
    TableMultiComponent,
    ModalComponent,
    ModalContainerComponent,
    ResultsModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
