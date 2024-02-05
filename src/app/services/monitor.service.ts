import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameInformation, Hint, Player } from '../dtos/play';

@Injectable({
  providedIn: 'root'
})
export class MonitorService {

  private url = 'https://arcade.jpromi.com';

  constructor(
    private httpClient: HttpClient
  ) { }

  getHint(points:number): Observable<Hint> {
    return this.httpClient.get<Hint>(`${this.url}/api/game/real/darts/hint?points=${points.toString()}`, { withCredentials: true });
  }

  getGameInformation(): Observable<GameInformation> {
    return this.httpClient.get<GameInformation>(`${this.url}/api/game/real/darts/monitor`, { withCredentials: true });
  }

  getPlayers(): Observable<Player[]> {
    return this.httpClient.get<Player[]>(`${this.url}/api/game/real/darts/score`, { withCredentials: true });
  }
}
