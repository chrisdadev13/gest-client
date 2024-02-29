import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../shared/constants';
import { CreateContact } from '../models/contact.interface';

export type CreateResponse = {
  id: number;
  name: string;
  description: string | null;
  phone: string | null;
  email: string;
  birthday: Date | null;
  address: string | null;
  favorite: boolean;
  userId: number;
};

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  httpClient = inject(HttpClient);

  create(
    body: CreateContact,
    access: string,
    refresh: string,
  ): Observable<CreateResponse | { [key: string]: any }> {
    return this.httpClient.post<CreateResponse>(`${API_URL}/contacts`, body, {
      headers: {
        Authentication: `Authentication=${access}`,
        Refresh: `Refresh=${refresh}`,
      },
    });
  }
}
