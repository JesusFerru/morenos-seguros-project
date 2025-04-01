import { Injectable } from '@angular/core';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';
import { Observable } from 'rxjs';
import { OriginModel } from '../models/OriginModel';

@Injectable({
    providedIn: 'root',
})
export class OriginService extends HttpServiceMoreno {
    private readonly endpoint = '/origins';

    getAll(): Observable<OriginModel[]> {
        return this.get<OriginModel[]>(this.endpoint);
    }

    getById(id: string): Observable<OriginModel> {
        return this.get<OriginModel>(`${this.endpoint}/${id}`);
    }

    create(origin: OriginModel): Observable<OriginModel> {
        return this.post<OriginModel>(this.endpoint, origin);
    }

    update(id: string, origin: OriginModel): Observable<void> {
        return this.put<void>(`${this.endpoint}/${id}`, origin);
    }

    deleteOrigin(id: string): Observable<void> {
        return this.delete<void>(`${this.endpoint}/${id}`);
    }
}
