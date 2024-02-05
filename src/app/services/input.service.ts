import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  private url = 'https://arcade.jpromi.com';

  constructor(
    public httpClient: HttpClient
  ) { }

  addPoint(point: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.url}/api/game/real/darts/play?type=add`, { points: point }, { withCredentials: true });
  }

  undoPoint(): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.url}/api/game/real/darts/play?type=undo`, null, { withCredentials: true });
  }
}
