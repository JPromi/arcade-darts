import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DartsService } from '../../services/darts.service';
import { Router } from '@angular/router';
import { InputService } from '../../services/input.service';
import { GameInformation, Player } from '../../dtos/play';
import { MonitorService } from '../../services/monitor.service';
import { timeInterval } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocalGameService } from '../../services/local/local-game.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent implements OnInit, OnDestroy {

  constructor(
    public dartsService: DartsService,
    public router: Router,
    public inputService: InputService,
    public monitorService: MonitorService,
    private localGameService: LocalGameService
  ) { }
  
  clock: string = '00:00';

  inputType: string = 'numbers';
  multiplier: string = '';
  keyInput: string = '';
  inputInterval: any;
  gameInformation: GameInformation = new GameInformation();
  soundPlaying: boolean = false;
  playerInterval: any;

  players: Player[] = [];
  playerList = {
    current: new Player(),
    next: new Player(),
    previous: new Player()
  }

  popup = {
    show: false
  }

  ngOnInit() {
    this.checkIfCurrentGame();
    if(environment.offline) {
      this.lGetGameSettings();
    } else {
      //load list
      this.getGameSettings();
      this.getPlayers();
  
      this.playerInterval = setInterval(() => {
        this.getPlayers();
      }, 15000);
    }

    this.setClock();
    setInterval(() => {
      this.setClock();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.playerInterval);
  }

  setClock() {
    const date = new Date();
    this.clock = date.toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' });
  }

  checkIfCurrentGame(inGame: boolean = false) {
    if(environment.offline) {
      this.localGameService.currentGame().then(
        (game) => {
          if(game && game.ended) {
            this.router.navigate(['/']);
          }
        }
      );
    } else {
      this.dartsService.isCurrentGame().subscribe(
        (isCurrentGame: boolean) => {
          if(!isCurrentGame) {
            if(inGame) {
              this.playWinningSound();
            }
            this.router.navigate(['/']);
          }
        }
      );
    }
  }

  getGameSettings() {
    this.monitorService.getGameInformation().subscribe(
      (game: GameInformation) => {
        this.gameInformation = game;
      }
    );
  }

  setPoints(points: string) {
    if(environment.offline) {
      this.localGameService.addPoint(this.playerList.current.playerId, this.multiplier + points).then(
        (response: any) => {
          this.gameInformation = this.localGameService.gameAsGame(response);
          this.players = this.gameInformation.player;
          this.setPlayerList();
          if(response.ended) {
            this.router.navigate(['/']);
          }
        }
      );
    } else {
      this.inputService.addPoint(this.multiplier + points).subscribe(
        (response: any) => {
          this.getPlayers();
        }
      );
    }

    //reset multiplier
    this.multiplier = '';
  }

  undo() {
    if(environment.offline) {
      this.localGameService.undoThrow().then(
        (response: any) => {
          this.gameInformation = this.localGameService.gameAsGame(response);
          this.players = this.gameInformation.player;
          this.setPlayerList();
        }
      );
    } else {
      this.inputService.undoPoint().subscribe(
        (response: any) => {
          this.getPlayers();
        }
      );
    }
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
    if(environment.offline) {
      this.lGetGameSettings();
    } else {
      this.monitorService.getPlayers().subscribe(
        (players: Player[]) => {
          if(this.players != players) {
            this.players = players;
            this.setPlayerList();
            this.checkIfCurrentGame(true);
          }
        }
      );
    }
    
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

  cancleGame(decision: boolean = false) {
    if(!decision) {
      return;
    }
    if(environment.offline) {
      this.localGameService.endGame().then(
        (response: any) => {
          this.router.navigate(['/']);
        }
      );
    } else {
      this.inputService.cancleGame().subscribe(
        (response: any) => {
          this.router.navigate(['/']);
        }
      );
    }
  }

  fullscreen() {
    if(document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  playWinningSound() {
    if(!this.soundPlaying) {
      this.soundPlaying = true;
      const audio = new Audio();
      audio.src = 'assets/sounds/WIN-chase-the-sun.mp3';
      audio.load();
      audio.play();
      audio.onended = () => {
        this.soundPlaying = false;
      }
    }
  }

  // local
  lGetGameSettings() {
    this.localGameService.currentGame().then(
      (game) => {
        if(game) {
          this.gameInformation = this.localGameService.gameAsGame(game);
          this.players = this.gameInformation.player;
          this.setPlayerList();
        }
      }
    );
  }

}
