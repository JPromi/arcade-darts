import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DartsService {

  private url = 'https://arcade.jpromi.com';

  constructor(
    private httpClient: HttpClient
  ) { }

  isCurrentGame(): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.url}/api/game/real/darts/status?type=game`, { withCredentials: true });
  }
}
