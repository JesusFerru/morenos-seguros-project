import { Injectable } from '@angular/core';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';

import { Observable } from 'rxjs';
import { InsuranceCompanyModel } from '../models/InsuranceCompanyModel';

@Injectable({
  providedIn: 'root',
})
export class InsuranceCompanyService extends HttpServiceMoreno {
  private readonly basePath = '/InsuranceCompanies';

  getAll(): Observable<InsuranceCompanyModel[]> {
    return this.get<InsuranceCompanyModel[]>(this.basePath);
  }

  getActive(): Observable<InsuranceCompanyModel[]> {
    return this.get<InsuranceCompanyModel[]>(`${this.basePath}/active`);
  }

  getById(id: number): Observable<InsuranceCompanyModel> {
    return this.get<InsuranceCompanyModel>(`${this.basePath}/${id}`);
  }

  create(payload: Partial<InsuranceCompanyModel>): Observable<InsuranceCompanyModel> {
    return this.post<InsuranceCompanyModel>(this.basePath, payload);
  }

  update(id: number, payload: Partial<InsuranceCompanyModel>): Observable<InsuranceCompanyModel> {
    return this.put<InsuranceCompanyModel>(`${this.basePath}/${id}`, payload);
  }
}
