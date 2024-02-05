import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  constructor(
    public httpClient: HttpClient
  ) { }

  addPoint(point: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${environment.domain.api}/api/game/real/darts/play?type=add`, { points: point }, { withCredentials: true });
  }

  undoPoint(): Observable<boolean> {
    return this.httpClient.post<boolean>(`${environment.domain.api}/api/game/real/darts/play?type=undo`, null, { withCredentials: true });
  }

  cancleGame(): Observable<boolean> {
    return this.httpClient.post<boolean>(`${environment.domain.api}/api/game/real/darts/play?type=cancel`, null, { withCredentials: true });
  }
}
