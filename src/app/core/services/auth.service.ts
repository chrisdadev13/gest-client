import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, firstValueFrom, of } from 'rxjs';
import { Login } from '../models/login.interface';
import { Register } from '../models/register.interface';
import { API_URL } from '../../shared/constants';

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  email: string;
  name: string;
  id: number;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient);

  login(body: Login): Observable<AuthResponse | { [key: string]: any }> {
    return this.httpClient.post<AuthResponse>(`${API_URL}/auth/login`, body);
  }

  register(body: Register): Observable<AuthResponse | { [key: string]: any }> {
    return this.httpClient.post<AuthResponse>(`${API_URL}/auth/register`, body);
  }
}
