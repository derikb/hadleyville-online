import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableListComponent } from './table-list/table-list.component';
import { TableResultComponent } from './table-result/table-result.component';
import { TableMultiComponent } from './table-multi/table-multi.component';

@NgModule({
  declarations: [
    AppComponent,
    TableListComponent,
    TableResultComponent,
    TableMultiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
