import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { UserList } from '../../dtos/settings';

@Injectable({
  providedIn: 'root'
})
export class LocalUserService {

  constructor(
    private db: NgxIndexedDBService
  ) { }

  /*
  delete user
  add user
  get user
  get users
  */

  addUser(username: string): void {
    this.db.add('players', { username: username }).subscribe();
  }

  deleteUser(userId: number): void {
    this.db.delete('players', userId).subscribe();
  }

  getUser(username: string): Promise<UserList | undefined> {
    return this.db.getByKey<UserList>('players', username).toPromise();
  }

  getUsers(): Promise<UserList[] | undefined> {
    return this.db.getAll<UserList>('players').toPromise();
  }
}
