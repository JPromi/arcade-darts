import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameInformation, Hint, Player } from '../dtos/play';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonitorService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getHint(points:number): Observable<Hint> {
    return this.httpClient.get<Hint>(`${environment.domain.api}/api/game/real/darts/hint?points=${points.toString()}`, { withCredentials: true });
  }

  getGameInformation(): Observable<GameInformation> {
    return this.httpClient.get<GameInformation>(`${environment.domain.api}/api/game/real/darts/monitor`, { withCredentials: true });
  }

  getPlayers(): Observable<Player[]> {
    return this.httpClient.get<Player[]>(`${environment.domain.api}/api/game/real/darts/score`, { withCredentials: true });
  }
}
