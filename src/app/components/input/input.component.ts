import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent implements OnInit {

  constructor() { }

  inputType: string = 'numbers';
  multiplier: string = '';
  keyInput: string = '';
  inputInterval: any;

  ngOnInit() {
  }

  setPoints(points: string) {
    console.log(this.multiplier + points);

    //reset multiplier
    this.multiplier = '';
  }

  // key
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if(event.key === 't') {
      this.multiplier = 'T';
    } else if(event.key === 'd') {
      this.multiplier = 'D';
    } else if(event.key === 's') {
      this.multiplier = '';
    } else {

      // set key input
      this.keyInput += event.key;

      // reset counter
      if (this.keyInput !== null) {
        clearInterval(this.inputInterval);
      }

      // reset key input after 500ms
      this.inputInterval = setInterval(() => {
        this.keyPointsInput();
        this.keyInput = '';
      }, 500);
    }

  }

  keyPointsInput() {
    var keyInput: number = parseInt(this.keyInput);
    if((keyInput >= 0 && keyInput <= 20) || (keyInput === 25)) {
      this.setPoints(keyInput.toString());
    }
  }


}
