import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';
import { CustomerModel } from '../models/CustomerModel';

@Injectable({ providedIn: 'root' })
export class CustomerService extends HttpServiceMoreno {
    private readonly basePath = '/Clients';

    getAll(): Observable<CustomerModel[]> {
        return this.get<CustomerModel[]>(this.basePath);
    }

    getActive(): Observable<CustomerModel[]> {
        return this.get<CustomerModel[]>(`${this.basePath}/active`);
    }

    getById(id: string): Observable<CustomerModel> {
        return this.get<CustomerModel>(`${this.basePath}/${id}`);
    }

    create(payload: Partial<CustomerModel>): Observable<CustomerModel> {
        return this.post<CustomerModel>(this.basePath, payload);
    }

    update(id: string, payload: Partial<CustomerModel>): Observable<CustomerModel> {
        return this.put<CustomerModel>(`${this.basePath}/${id}`, payload);
    }
}
