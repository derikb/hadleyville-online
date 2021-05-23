import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hadleyville-online';
  tablesOpen: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleTable(ev: Event) : void {
    if (ev && ev.preventDefault) {
      ev.preventDefault();
    }
    this.tablesOpen = !this.tablesOpen;
  }

}
