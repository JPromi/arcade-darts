import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { GameSettings, UserList } from '../../dtos/settings';
import { DartsService } from '../../services/darts.service';
import { Router } from '@angular/router';
import { LocalUserService } from '../../services/local/local-user.service';
import { environment } from '../../../environments/environment';
import { LocalGameService } from '../../services/local/local-game.service';

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
    private localUserService: LocalUserService,
    private localGameService: LocalGameService
  ) { }

  userList: UserList[] = [];
  gameSettings: GameSettings = new GameSettings();

  env = environment;
  newPlayerInput: string = '';
  deletePlayer: boolean = false;

  ngOnInit() {
    this.checkIfCurrentGame();
    if(!environment.offline) {
      this.getAllUsers();
    } else {
      this.localUserService.getUsers().then(
        (users) => {
          console.log(users);
          if(users) {
            this.userList = users;
          }
        }
      );
    }
  }

  checkIfCurrentGame() {
    if(environment.offline) {
      this.localGameService.currentGame().then(
        (game) => {
          if(game && !game.ended) {
            this.router.navigate(['/game']);
          }
        }
      );
    } else {
      this.dartsService.isCurrentGame().subscribe(
        (isCurrentGame: boolean) => {
          if(isCurrentGame) {
            this.router.navigate(['/game']);
          }
        }
      );
    }
  }

  getAllUsers() {
    this.settingsService.getAllUsers().subscribe(
      (data) => {
        this.userList = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  toggleUser(userId: number) {
    if(this.deletePlayer && environment.offline) {
      this.localUserService.deleteUser(userId);
      this.userList = this.userList.filter(user => user.userId !== userId);
      return;
    } else {
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
    if(!environment.offline) {
      if(this.gameSettings.players.length > 1 && this.gameSettings.players.length < 7) {
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
      }
    } else {
      if(this.gameSettings.players.length > 1 && this.gameSettings.players.length < 7) {
        this.localGameService.newGame(this.userList, this.gameSettings.mode, this.gameSettings.checkout).subscribe(
          (data) => {
            this.router.navigate(['/game']);
          }
        );
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

  // local
  lAddUser() {
    if(this.newPlayerInput.length > 0) {
      this.localUserService.addUser(this.newPlayerInput);
      this.userList.push(new UserList(this.userList.length + 1, this.newPlayerInput));
      this.newPlayerInput = '';
    }
  }
}
