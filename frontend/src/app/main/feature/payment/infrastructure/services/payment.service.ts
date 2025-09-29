// payment.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';
import { PaymentModel } from '../models/PaymentModel';

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends HttpServiceMoreno {
  private readonly basePath = '/Payments';

  getAll(): Observable<PaymentModel[]> {
    return this.get<PaymentModel[]>(this.basePath);
  }

  getActive(): Observable<PaymentModel[]> {
    return this.get<PaymentModel[]>(`${this.basePath}/active`);
  }

  getById(id: string): Observable<PaymentModel> {
    return this.get<PaymentModel>(`${this.basePath}/${id}`);
  }

  create(payload: Partial<PaymentModel>): Observable<PaymentModel> {
    return this.post<PaymentModel>(this.basePath, payload);
  }

  update(id: string, payload: Partial<PaymentModel>): Observable<PaymentModel> {
    return this.put<PaymentModel>(`${this.basePath}/${id}`, payload);
  }
}