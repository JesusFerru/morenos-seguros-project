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

    getByDni(dni: string): Observable<UserModel> {
        return this.get<UserModel>(`${this.endpoint}/${dni}`);
    }

    create(user: UserModel): Observable<UserModel> {
        return this.post<UserModel>(`${this.endpoint}`, user);
    }

    update(dni: string, user: UserModel): Observable<void> {
        return this.put<void>(`${this.endpoint}/${dni}`, user);
    }

    updateStatus(dni: string, status: number): Observable<void> {
        return this.put<void>(`${this.endpoint}/${dni}/status`, status);
    }
}
