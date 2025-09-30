// policy.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';
import { PolicyModel } from '../models/PolicyModel';

@Injectable({
  providedIn: 'root',
})
export class PolicyService extends HttpServiceMoreno {
  private readonly basePath = '/Policies';

  getAll(): Observable<PolicyModel[]> {
    return this.get<PolicyModel[]>(this.basePath);
  }

  getActive(): Observable<PolicyModel[]> {
    return this.get<PolicyModel[]>(`${this.basePath}/active`);
  }

  getById(id: string): Observable<PolicyModel> {
    return this.get<PolicyModel>(`${this.basePath}/${id}`);
  }

  create(payload: Partial<PolicyModel>): Observable<PolicyModel> {
    return this.post<PolicyModel>(this.basePath, payload);
  }

  update(id: string, payload: Partial<PolicyModel>): Observable<PolicyModel> {
    return this.put<PolicyModel>(`${this.basePath}/${id}`, payload);
  }

  delete(id: string): Observable<any> {
    return this.delete(`${this.basePath}/${id}`);
  }
}
