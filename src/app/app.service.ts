import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppService {
  private readonly API = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

  getClima(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/clima/extract`);
  }

  getDesmatamento(): Observable<any> {
    return this.http.get<any>(`${this.API}/desmatamento`);
  }

  getNdvi(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/ndvi`);
  }

  getPrevisaoClima(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/previsao/clima`);
  }

  getPrevisaoDesmatamento(): Observable<any> {
    return this.http.get<any>(`${this.API}/previsao/area_desmatada`);
  }

  getPrevisaoNdvi(): Observable<any> {
    return this.http.get<any>(`${this.API}/previsao/ndvi`);
  }
}
