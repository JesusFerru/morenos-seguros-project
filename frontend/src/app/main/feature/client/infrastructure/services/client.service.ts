// client.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';
import { ClientModel } from '../models/ClientModel';

@Injectable({
  providedIn: 'root',
})
export class ClientService extends HttpServiceMoreno {
  private readonly basePath = '/Clients';

  getAll(): Observable<ClientModel[]> {
    return this.get<ClientModel[]>(this.basePath);
  }

  getActive(): Observable<ClientModel[]> {
    return this.get<ClientModel[]>(`${this.basePath}/active`);
  }

  getById(id: string): Observable<ClientModel> {
    return this.get<ClientModel>(`${this.basePath}/${id}`);
  }

  create(payload: Partial<ClientModel>): Observable<ClientModel> {
    return this.post<ClientModel>(this.basePath, payload);
  }

  update(id: string, payload: Partial<ClientModel>): Observable<ClientModel> {
    return this.put<ClientModel>(`${this.basePath}/${id}`, payload);
  }
}