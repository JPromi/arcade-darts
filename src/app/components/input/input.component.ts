import { Component, HostListener, OnInit } from '@angular/core';
import { DartsService } from '../../services/darts.service';
import { Router } from '@angular/router';
import { InputService } from '../../services/input.service';
import { GameInformation, Player } from '../../dtos/play';
import { MonitorService } from '../../services/monitor.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent implements OnInit {

  constructor(
    public dartsService: DartsService,
    public router: Router,
    public inputService: InputService,
    public monitorService: MonitorService
  ) { }

  inputType: string = 'numbers';
  multiplier: string = '';
  keyInput: string = '';
  inputInterval: any;
  gameInformation: GameInformation = new GameInformation();

  players: Player[] = [];
  playerList = {
    current: new Player(),
    next: new Player(),
    previous: new Player()
  }

  ngOnInit() {
    this.checkIfCurrentGame();

    //load list
    this.getGameSettings();
    this.getPlayers();

    setInterval(() => {
      this.getPlayers();
    }, 15000);
  }

  checkIfCurrentGame() {
    this.dartsService.isCurrentGame().subscribe(
      (isCurrentGame: boolean) => {
        if(!isCurrentGame) {
          this.router.navigate(['/']);
        }
      }
    );
  }

  getGameSettings() {
    this.monitorService.getGameInformation().subscribe(
      (game: GameInformation) => {
        this.gameInformation = game;
      }
    );
  }

  setPoints(points: string) {
    this.inputService.addPoint(this.multiplier + points).subscribe(
      (response: any) => {
        this.getPlayers();
      }
    );

    //reset multiplier
    this.multiplier = '';
  }

  undo() {
    this.inputService.undoPoint().subscribe(
      (response: any) => {
        this.getPlayers();
      }
    );
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

  getPlayers() {
    this.monitorService.getPlayers().subscribe(
      (players: Player[]) => {
        if(this.players != players) {
          this.players = players;
          this.setPlayerList();
          this.checkIfCurrentGame();
        }
      }
    );
  }

  setPlayerList() {
    this.players.forEach((player, index) => {
      if(player.current) {
        this.playerList.current = player;
        this.playerList.next = this.players[index + 1] ? this.players[index + 1] : this.players[0];
        this.playerList.previous = this.players[index - 1] ? this.players[index - 1] : this.players[this.players.length - 1];
      }
    });
  }

  cancleGame() {
    this.inputService.cancleGame().subscribe(
      (response: any) => {
        this.router.navigate(['/']);
      }
    );
  }

  fullscreen() {
    if(document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

}
