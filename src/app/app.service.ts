import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppService {
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

  getData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dados`);
  }

  getPrevisao(): Observable<any[]> {
    const params = new HttpParams()
      .set('format', 'full')
      .set('combined', 'true');

    return this.http.get<any[]>(`${this.apiUrl}/previsao`, { params });
  }
}

