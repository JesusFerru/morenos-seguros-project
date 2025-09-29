// bank.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';
import { BankAccountModel } from '../models/BankAccountModel';

@Injectable({
  providedIn: 'root',
})
export class BankService extends HttpServiceMoreno {
  private readonly basePath = '/BankAccounts';

  getAll(): Observable<BankAccountModel[]> {
    return this.get<BankAccountModel[]>(this.basePath);
  }

  getActive(): Observable<BankAccountModel[]> {
    return this.get<BankAccountModel[]>(`${this.basePath}/active`);
  }

  getById(id: string): Observable<BankAccountModel> {
    return this.get<BankAccountModel>(`${this.basePath}/${id}`);
  }

  create(payload: Partial<BankAccountModel>): Observable<BankAccountModel> {
    return this.post<BankAccountModel>(this.basePath, payload);
  }

  update(id: string, payload: Partial<BankAccountModel>): Observable<BankAccountModel> {
    return this.put<BankAccountModel>(`${this.basePath}/${id}`, payload);
  }
}