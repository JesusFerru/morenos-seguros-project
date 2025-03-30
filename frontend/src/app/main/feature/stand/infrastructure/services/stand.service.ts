import { Injectable } from '@angular/core';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';
import { Observable } from 'rxjs';
import { StandModel } from '../models/StandModel';

@Injectable({
    providedIn: 'root',
})
export class StandService extends HttpServiceMoreno {
    private readonly endpoint = '/stands';

    getAll(): Observable<StandModel[]> {
        return this.get<StandModel[]>(this.endpoint);
    }

    getById(id: string): Observable<StandModel> {
        return this.get<StandModel>(`${this.endpoint}/${id}`);
    }

    create(stand: StandModel): Observable<StandModel> {
        return this.post<StandModel>(this.endpoint, stand);
    }

    update(id: string, stand: StandModel): Observable<void> {
        return this.put<void>(`${this.endpoint}/${id}`, stand);
    }

    deleteStand(id: string): Observable<void> {
        return this.delete<void>(`${this.endpoint}/${id}`);
    }

    updateStatus(id: string, status: number): Observable<void> {
        return this.put<void>(`${this.endpoint}/${id}/status`, status);
    }
}
