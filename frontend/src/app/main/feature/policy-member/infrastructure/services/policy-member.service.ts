// policy-member.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';
import { PolicyMemberModel } from '../models/PolicyMemberModel';

@Injectable({
  providedIn: 'root',
})
export class PolicyMemberService extends HttpServiceMoreno {
  private readonly basePath = '/PolicyMembers';

  getAll(): Observable<PolicyMemberModel[]> {
    return this.get<PolicyMemberModel[]>(this.basePath);
  }

  getActive(): Observable<PolicyMemberModel[]> {
    return this.get<PolicyMemberModel[]>(`${this.basePath}/active`);
  }

  getById(id: string): Observable<PolicyMemberModel> {
    return this.get<PolicyMemberModel>(`${this.basePath}/${id}`);
  }

  getByPolicyId(policyId: string): Observable<PolicyMemberModel[]> {
    return this.get<PolicyMemberModel[]>(`${this.basePath}/policy/${policyId}`);
  }

  getByClientId(clientId: string): Observable<PolicyMemberModel[]> {
    return this.get<PolicyMemberModel[]>(`${this.basePath}/client/${clientId}`);
  }

  create(payload: Partial<PolicyMemberModel>): Observable<PolicyMemberModel> {
    return this.post<PolicyMemberModel>(this.basePath, payload);
  }

  update(id: string, payload: Partial<PolicyMemberModel>): Observable<PolicyMemberModel> {
    return this.put<PolicyMemberModel>(`${this.basePath}/${id}`, payload);
  }
}