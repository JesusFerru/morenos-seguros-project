import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';
import { Observable } from 'rxjs';
import { UpdateEventDto } from '../dtos/UpdateEventDto';
import { UpdateEventStandsDto } from '../dtos/UpdateEventStandsDto';
import { EventModel } from '../models/EventModel';

@Injectable({
    providedIn: 'root',
})
export class EventService extends HttpServiceMoreno {
    private readonly endpoint = '/events';

    getAll(): Observable<EventModel[]> {
        return this.get<EventModel[]>(this.endpoint);
    }

    getById(id: string): Observable<EventModel> {
        return this.get<EventModel>(`${this.endpoint}/${id}`);
    }

    create(event: EventModel): Observable<EventModel> {
        console.log(event);
        return this.post<EventModel>(this.endpoint, event);
    }

    update(id: string, dto: UpdateEventDto): Observable<void> {
        return this.put<void>(`${this.endpoint}/${id}`, dto);
    }

    updateStands(id: string, dto: UpdateEventStandsDto): Observable<void> {
        return this.put<void>(`${this.endpoint}/${id}/stands`, dto);
    }

    deleteEvent(id: string): Observable<void> {
        return this.delete<void>(`${this.endpoint}/${id}`);
    }

    exportOriginsExcel(dto: any): Observable<Blob> {
        const params = new HttpParams().set('data', JSON.stringify(dto));
        return this.getDownload(`${this.endpoint}/export-origins`, params);
    }
}




