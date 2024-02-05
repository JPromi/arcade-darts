import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DartsService {

  constructor(
    private httpClient: HttpClient
  ) { }

  isCurrentGame(): Observable<boolean> {
    return this.httpClient.get<boolean>(`${environment.domain.api}/api/game/real/darts/status?type=game`, { withCredentials: true });
  }
}
