import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameSettings, UserList } from '../dtos/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private url = 'https://arcade.jpromi.com';

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllUsers(): Observable<UserList[]> {
    return this.httpClient.get<UserList[]>(`${this.url}/api/game/real/darts/settings?mm=user`, { withCredentials: true });
  }

  newGame(gameSettings: GameSettings): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.url}/api/game/real/darts/settings?mm=new`, gameSettings, { withCredentials: true });
  }
}
