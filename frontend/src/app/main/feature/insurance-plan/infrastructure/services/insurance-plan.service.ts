// insurance-plan.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';
import { InsurancePlanModel } from '../models/InsurancePlanModel';

@Injectable({
  providedIn: 'root',
})
export class InsurancePlanService extends HttpServiceMoreno {
  private readonly basePath = '/InsurancePlans';

  getAll(): Observable<InsurancePlanModel[]> {
    return this.get<InsurancePlanModel[]>(this.basePath);
  }

  getActive(): Observable<InsurancePlanModel[]> {
    return this.get<InsurancePlanModel[]>(`${this.basePath}/active`);
  }

  getByCompanyId(companyId: string): Observable<InsurancePlanModel[]> {
    return this.get<InsurancePlanModel[]>(`${this.basePath}/company/${companyId}`);
  }

  getById(id: string): Observable<InsurancePlanModel> {
    return this.get<InsurancePlanModel>(`${this.basePath}/${id}`);
  }

  create(payload: Partial<InsurancePlanModel>): Observable<InsurancePlanModel> {
    return this.post<InsurancePlanModel>(this.basePath, payload);
  }

  update(id: string, payload: Partial<InsurancePlanModel>): Observable<InsurancePlanModel> {
    return this.put<InsurancePlanModel>(`${this.basePath}/${id}`, payload);
  }
}
