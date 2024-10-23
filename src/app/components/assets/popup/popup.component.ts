import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'asset-popup',
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {
  @Input() title: string = "";
  @Input() message: string = "";
  @Input() type: string = "info"; // info, warning, error, ok
  @Input() show: boolean = false;
  @Output() showChange = new EventEmitter<boolean>();
  @Output() decision = new EventEmitter<boolean>();

  constructor() {}

  closePopup(decision: boolean) {
    this.showChange.emit(false);
    this.decision.emit(decision);
  }
}
