import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hadleyville-online';
  tablesOpen: Boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleTable(tableOpen: Boolean) : void {
    this.tablesOpen = tableOpen;
  }

}
