/**
 * A DOM element that serves as a site for injecting a modal.
 */
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalService } from '../modal.service';


@Component({
  selector: 'app-modalcontainer',
  template: `<div #modalcontainer></div>`,
  styles: []
})
export class ModalContainerComponent implements OnInit {
  @ViewChild('modalcontainer', { static: true, read: ViewContainerRef })
  viewContainerRef: ViewContainerRef;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
      this.modalService.RegisterContainerRef(this.viewContainerRef);
  }
}
