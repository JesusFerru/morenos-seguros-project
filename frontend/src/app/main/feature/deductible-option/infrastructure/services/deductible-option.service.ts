import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';
import { DeductibleOptionModel } from '../models/DeductibleOptionModel';

@Injectable({
  providedIn: 'root',
})
export class DeductibleOptionService extends HttpServiceMoreno {
  private readonly basePath = '/DeductibleOptions';

  getAll(): Observable<DeductibleOptionModel[]> {
    return this.get<DeductibleOptionModel[]>(this.basePath);
  }

  getActive(): Observable<DeductibleOptionModel[]> {
    return this.get<DeductibleOptionModel[]>(`${this.basePath}/active`);
  }

  getById(id: string): Observable<DeductibleOptionModel> {
    return this.get<DeductibleOptionModel>(`${this.basePath}/${id}`);
  }

  getByPlanId(planId: string): Observable<DeductibleOptionModel[]> {
    return this.get<DeductibleOptionModel[]>(`${this.basePath}/plan/${planId}`);
  }

  create(payload: Partial<DeductibleOptionModel>): Observable<DeductibleOptionModel> {
    return this.post<DeductibleOptionModel>(this.basePath, payload);
  }

  update(id: string, payload: Partial<DeductibleOptionModel>): Observable<DeductibleOptionModel> {
    return this.put<DeductibleOptionModel>(`${this.basePath}/${id}`, payload);
  }
}
