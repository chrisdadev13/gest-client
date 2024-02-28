import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Login } from '../models/login.interface';
import { Register } from '../models/register.interface';
import { API_URL } from '../../shared/constants';

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  email: string;
  id: number;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient);

  login(body: Login): Promise<AuthResponse | any> {
    return firstValueFrom(
      this.httpClient.post<AuthResponse>(`${API_URL}/auth/login`, body),
    );
  }

  register(body: Register): Promise<AuthResponse | any> {
    return firstValueFrom(
      this.httpClient.post<AuthResponse>(`${API_URL}/auth/register`, body),
    );
  }
}