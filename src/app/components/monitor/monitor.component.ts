import { Component, OnInit } from '@angular/core';
import { GameInformation, Player } from '../../dtos/play';
import { MonitorService } from '../../services/monitor.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.scss'
})
export class MonitorComponent implements OnInit {

  constructor(
    public monitorService: MonitorService
  ) { }

  clock: string = '00:00';
  loaded: boolean = false;

  players: Player[] = [];

  gameInformation: GameInformation = new GameInformation();

  currentPlayer: Player = new Player();

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

}
