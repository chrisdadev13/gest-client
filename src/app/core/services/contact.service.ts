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

export type ListParams = {
  skip: number;
  take: number;
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

  list(
    params: ListParams,
    access: string,
    refresh: string,
  ): Observable<CreateResponse[] | { [key: string]: any }> {
    return this.httpClient.get<CreateResponse>(
      `${API_URL}/contacts?skip=${params.skip}&take=${params.take}`,
      {
        headers: {
          Authentication: `Authentication=${access}`,
          Refresh: `Refresh=${refresh}`,
        },
      },
    );
  }
  updateOne(
    id: number,
    body: CreateContact,

    access: string,
    refresh: string,
  ): Observable<CreateContact | { [key: string]: any }> {
    return this.httpClient.put<CreateContact>(
      `${API_URL}/contacts/${id}`,
      body,
      {
        headers: {
          Authentication: `Authentication=${access}`,
          Refresh: `Refresh=${refresh}`,
        },
      },
    );
  }
  getOne(
    id: number,
    access: string,
    refresh: string,
  ): Observable<{ contact: CreateContact } | { [key: string]: any }> {
    return this.httpClient.get<{ contact: CreateContact }>(
      `${API_URL}/contacts/${id}`,
      {
        headers: {
          Authentication: `Authentication=${access}`,
          Refresh: `Refresh=${refresh}`,
        },
      },
    );
  }

  deleteContact(
    id: number,
    access: string,
    refresh: string,
  ): Observable<CreateContact | { [key: string]: any }> {
    return this.httpClient.delete<CreateContact>(`${API_URL}/contacts/${id}`, {
      headers: {
        Authentication: `Authentication=${access}`,
        Refresh: `Refresh=${refresh}`,
      },
    });
  }
}
