import { Component, OnInit, ElementRef } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  element: HTMLElement;
  title: string = 'a modal';
  content: string = 'some content';
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
