import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameSettings, UserList } from '../dtos/settings';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllUsers(): Observable<UserList[]> {
    return this.httpClient.get<UserList[]>(`${environment.domain.api}/api/game/real/darts/settings?mm=user`, { withCredentials: true });
  }

  newGame(gameSettings: GameSettings): Observable<boolean> {
    return this.httpClient.post<boolean>(`${environment.domain.api}/api/game/real/darts/settings?mm=new`, gameSettings, { withCredentials: true });
  }
}
