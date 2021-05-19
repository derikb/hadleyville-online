import { Component, OnInit } from '@angular/core';
import { Town } from '../../towns/town';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  createTown() : void {
    console.log(new Town({}));
  }
}
