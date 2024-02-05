import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { UserList } from '../../dtos/settings';
import { DartsService } from '../../services/darts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  constructor(
    public settingsService: SettingsService,
    public dartsService: DartsService,
    public router: Router
  ) { }

  userList: UserList[] = [];

  selectedUserIds: number[] = [];

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
      },
      (err) => {
        console.log(err);
      }
    );
  }

  toggleUser(userId: number) {

    if (this.selectedUserIds.includes(userId)) {
      this.selectedUserIds = this.selectedUserIds.filter(id => id !== userId);
    } else {
      if(this.selectedUserIds.length < 6) {
        this.selectedUserIds.push(userId);
      } else {
        console.log('Max 6 players allowed');
      }
    }

  }

  getUserNumber(userId: number): string {
    var index = this.selectedUserIds.indexOf(userId);
    if(index >= 0) {
      return (index + 1).toString();
    } else {
      return '';
    }
  }

  randomizePlayerList() {
    this.selectedUserIds = this.selectedUserIds.sort(() => Math.random() - 0.5);
  }
}
