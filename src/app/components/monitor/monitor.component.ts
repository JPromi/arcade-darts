import { Component, OnInit } from '@angular/core';
import { GameInformation, Player } from '../../dtos/play';
import { MonitorService } from '../../services/monitor.service';
import { DartsService } from '../../services/darts.service';
import { LocalGameService } from '../../services/local/local-game.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.scss'
})
export class MonitorComponent implements OnInit {

  constructor(
    public monitorService: MonitorService,
    public dartsService: DartsService,
    public localGameService: LocalGameService
  ) { }

  clock: string = '00:00';
  loaded: boolean = false;
  soundPlaying: boolean = false;

  players: Player[] = [];

  gameInformation: GameInformation = new GameInformation();

  currentPlayer: Player = new Player();

  gameIsActive: boolean = false;

  ngOnInit() {
  
    //clock
    this.setClock();
    setInterval(() => {
      this.setClock();
    }, 1000);

    if(environment.offline) {
      // load players
      this.lGetPlayerInformation();

      setInterval(() => {
        this.lGetGameInformation();
        this.lGetPlayerInformation();
      }, 1000);
    } else {
      this.getGameInformation();
  
      // load players
      this.getPlayerInformation();
  
      setInterval(() => {
        this.getPlayerInformation();
      }, 5000);
    }
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
        if(!response) {
          if(this.gameIsActive != response) {
            this.playWinningSound();
          }
        }
        this.gameIsActive = response;
      }
    );
  }

  playWinningSound() {
    if(!this.soundPlaying) {
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
  lGetGameInformation() {
    this.localGameService.currentGame().then(gameInformation => {
      if(gameInformation) {
        this.gameInformation = this.localGameService.gameAsGame(gameInformation);
        this.loaded = true;
        this.gameIsActive = !gameInformation.ended;
      }
    });
  }

  lGetPlayerInformation() {
    this.localGameService.currentGame().then(gameInformation => {
      if(gameInformation) {
        this.players = this.localGameService.gameAsGame(gameInformation).player;
        this.players.forEach(
          player => {
  
            if(player.current) {
              this.currentPlayer = player;
            }
  
          }
        );
      }
    });
  }

}
