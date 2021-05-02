import { Component, OnInit, ElementRef } from '@angular/core';
import { ModalService } from '../modal.service';
import { RandomTable, RandomTableResultSet } from 'rpg-table-randomizer/src/random_table.js';

@Component({
  selector: 'app-results-modal',
  templateUrl: './results-modal.component.html',
  styleUrls: ['./results-modal.component.css']
})
export class ResultsModalComponent implements OnInit {
  element: HTMLElement;
  table?: RandomTable = null;
  resultSet: RandomTableResultSet;
  destroy: Function;

  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
  }

  closeModal() {
    this.destroy();
  }

}
