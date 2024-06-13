import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { UserList } from '../../dtos/settings';
import { Player } from '../../dtos/play';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalPlayerService {

  constructor(
    private dbService: NgxIndexedDBService
  ) { }

  addPlayer(player: UserList) {
    const playerObj = {
      username: player.username
    };
    this.dbService.add('user', playerObj).subscribe(() => {
      console.log('User added');
    }, (error) => {
      console.error('Error adding user:', error);
    });
  }

  removePlayer(player: UserList) {
    this.dbService.delete('user', player?.userId || 0).subscribe(() => {
      console.log('User deleted');
    }, (error) => {
      console.error('Error deleting user:', error);
    });
  }

  getPlayers() {
    return this.dbService.getAll('user');
  }

  getPlayerById(id: number): Observable<Player> {
    // return this.dbService.getByID<Player>('user', id).toPromise();
    return this.dbService.getByID<Player>('user', id);
  }
}
