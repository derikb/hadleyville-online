/**
 * A box that shows a roll button and a result.
 */
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { RandomtableService } from '../randomtable.service';

@Component({
  selector: 'app-roller',
  templateUrl: './roller.component.html',
  styleUrls: ['./roller.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class RollerComponent implements OnInit {
  /** Can be any die syntax like "3d4+1" or "1d10-2" */
  @Input() die: string = '2d6';
  /** the result of the roll */
  result?: number;

  constructor(private tableService: RandomtableService) { }

  ngOnInit(): void {
  }

  /**
   * Trigger a roll and show it.
   */
  roll(): void {
    this.result = this.tableService.roll(this.die);
  }
}
