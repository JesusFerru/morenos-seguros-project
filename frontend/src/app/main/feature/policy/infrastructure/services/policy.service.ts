import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';
import { Observable } from 'rxjs';
import { PolicyModel } from '../../presentation/PolicyModel';
import { UpdatePolicyDto } from '../dtos/UpdatePolicy';


@Injectable({
    providedIn: 'root',
})
export class PolicyService extends HttpServiceMoreno {
    private readonly endpoint = '/events';

    getAll(): Observable<PolicyModel[]> {
        return this.get<PolicyModel[]>(this.endpoint);
    }

    getById(id: string): Observable<PolicyModel> {
        return this.get<PolicyModel>(`${this.endpoint}/${id}`);
    }

    create(event: PolicyModel): Observable<PolicyModel> {
        console.log(event);
        return this.post<PolicyModel>(this.endpoint, event);
    }

    update(id: string, dto: UpdatePolicyDto): Observable<void> {
        return this.put<void>(`${this.endpoint}/${id}`, dto);
    }

    exportOriginsExcel(dto: any): Observable<Blob> {
        const params = new HttpParams().set('data', JSON.stringify(dto));
        return this.getDownload(`${this.endpoint}/export-origins`, params);
    }
}
