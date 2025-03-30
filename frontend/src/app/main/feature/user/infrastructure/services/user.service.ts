import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';
import { Observable } from 'rxjs';
import { UserModel } from '../models/UserModel';

@Injectable({
    providedIn: 'root',
})
export class UserService extends HttpServiceMoreno {
    private readonly endpoint = '/users';

    getAll(): Observable<UserModel[]> {
        return this.get<UserModel[]>(this.endpoint);
    }

    getById(id: string): Observable<UserModel> {
        return this.get<UserModel>(`${this.endpoint}/${id}`);
    }

    create(user: UserModel): Observable<UserModel> {
        return this.post<UserModel>(this.endpoint, user);
    }

    update(id: string, user: UserModel): Observable<void> {
        return this.put<void>(`${this.endpoint}/${id}`, user);
    }

    deleteUser(id: string): Observable<void> {
        return this.delete<void>(`${this.endpoint}/${id}`);
    }

    updateStatus(id: string, status: number): Observable<void> {
        return this.put<void>(`${this.endpoint}/${id}/status`, status);
    }

    downloadUsersExcel(): Observable<Blob> {
        return this.getDownload(`${this.endpoint}/export`, new HttpParams());
    }

}
