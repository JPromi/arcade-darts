import { Component, OnInit } from '@angular/core';
import { GameInformation, Player } from '../../dtos/play';
import { MonitorService } from '../../services/monitor.service';
import { DartsService } from '../../services/darts.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.scss'
})
export class MonitorComponent implements OnInit {

  constructor(
    public monitorService: MonitorService,
    public dartsService: DartsService
  ) { }

  clock: string = '00:00';
  loaded: boolean = false;

  players: Player[] = [];

  gameInformation: GameInformation = new GameInformation();

  currentPlayer: Player = new Player();
  winnerPlayer: Player = new Player();

  gameIsActive: boolean = false;

  ngOnInit() {

    this.getGameInformation();

    //clock
    this.setClock();
    setInterval(() => {
      this.setClock();
    }, 1000);

    // load players
    this.getPlayerInformation();

    setInterval(() => {
      this.getPlayerInformation();
    }, 5000);


    // TMP
    // this.getHint(this.players[this.counter]);
    // this.currentPlayer = this.players[this.counter];
  }

  setClock() {
    const date = new Date();
    this.clock = date.toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' });
  }

  getHint(player: Player) {
    this.monitorService.getHint(player.score).subscribe(hint => {
      this.players[player.number - 1].throwsHint = hint;
    });
  }

  getGameInformation() {
    this.monitorService.getGameInformation().subscribe(gameInformation => {
      this.gameInformation = gameInformation;
      this.loaded = true;
    });
  }

  getPlayerInformation() {
    this.monitorService.getPlayers().subscribe(players => {
      this.checkGameStatus();

      if(this.players != players) {
        players.forEach(
          player => {
  
            if(player.current) {
              this.currentPlayer = player;
            }
  
          }
        );
        
        this.players = players;

      }
    });
  }

  fullscreen() {
    if(document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  checkGameStatus() {
    this.dartsService.isCurrentGame().subscribe(
      (response: boolean) => {
        this.gameIsActive = response;

        if(!response) {
          this.getWinner();
        }
      }
    );
  }

  getWinner() {
    this.players.forEach(player => {
      if(player.score === 0) {
        if(this.winnerPlayer != player) {
          this.winnerPlayer = player;
        }
      }
    });
  }

}
