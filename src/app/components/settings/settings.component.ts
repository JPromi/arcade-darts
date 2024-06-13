import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { GameSettings, UserList } from '../../dtos/settings';
import { DartsService } from '../../services/darts.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LocalGameService } from '../../services/local/local-game.service';
import { LocalPlayerService } from '../../services/local/local-player.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  constructor(
    public settingsService: SettingsService,
    public dartsService: DartsService,
    public router: Router,
    private localGameService: LocalGameService,
    private localPlayerService: LocalPlayerService
  ) { }

  userList: UserList[] = [];
  gameSettings: GameSettings = new GameSettings();

  ngOnInit() {
    this.checkIfCurrentGame();
    this.getAllUsers();
  }

  checkIfCurrentGame() {
    this.dartsService.isCurrentGame().subscribe(
      (isCurrentGame: boolean) => {
        if(isCurrentGame) {
          this.router.navigate(['/game']);
        }
      }
    );
  }

  getAllUsers() {
    this.settingsService.getAllUsers().subscribe(
      (data) => {
        this.userList = data;
        // data.forEach(user => {
        //   this.localPlayerService.addPlayer(user);
        // });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  toggleUser(userId: number) {

    if (this.gameSettings.players.includes(userId)) {
      this.gameSettings.players = this.gameSettings.players.filter(id => id !== userId);
    } else {
      if(this.gameSettings.players.length < 6) {
        this.gameSettings.players.push(userId);
      } else {
        console.log('Max 6 players allowed');
      }
    }

  }

  getUserNumber(userId: number): string {
    var index = this.gameSettings.players.indexOf(userId);
    if(index >= 0) {
      return (index + 1).toString();
    } else {
      return '';
    }
  }

  randomizePlayerList() {
    this.gameSettings.players = this.gameSettings.players.sort(() => Math.random() - 0.5);
  }

  newGame() {
    if(this.gameSettings.players.length > 1 && this.gameSettings.players.length < 7) {
      if(!environment.local.play) {
        this.settingsService.newGame(this.gameSettings).subscribe(
          (data) => {
            if(data) {
              this.router.navigate(['/game']);
            }
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        this.localGameService.startGame(this.gameSettings).then(() => {
          this.router.navigate(['/game']);
        });
      }
    }
  }

  fullscreen() {
    if(document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }
}
