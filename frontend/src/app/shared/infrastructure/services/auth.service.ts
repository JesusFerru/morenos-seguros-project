import { Injectable, inject } from '@angular/core';
import { AUTH_TOKEN } from 'app/shared/domain/constants/const';
import { RefreshToken } from 'app/shared/domain/models/RefreshTokenModel';
import { Observable, catchError, map, of } from 'rxjs';
import { LoginModel } from '../../../main/feature/login/infrastructure/models/LoginRequest.model';
import { ResponseToken } from '../../domain/models/ResponseToken.model';
import { AuthUtils } from '../helpers/auth.utils';
import { HttpServiceMoreno } from '../helpers/services/httpMoreno.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService extends HttpServiceMoreno {
    private _authenticated: boolean = false;
    private _userService = inject(UserService);


    getToken(): string {
        const token = localStorage.getItem(AUTH_TOKEN);
        return token && token !== 'undefined' ? token : '';
    }


    public authenticateSuccess(token: string): void {
        localStorage.removeItem(AUTH_TOKEN);
        localStorage.setItem(AUTH_TOKEN, token);
        this._authenticated = true;
    }

    public cleanLocalStorage(): void {
        localStorage.clear();
        localStorage.removeItem(AUTH_TOKEN);
        this._authenticated = false;
    }

    login(login: LoginModel): Observable<ResponseToken> {
        return this.post<ResponseToken>('/login', login, true).pipe(
            map((response: ResponseToken) => {
                this.authenticateSuccess(response.accessToken);
                this._userService.user = response;
                return response;
            })
        );
    }

    refreshDataUser(): Observable<boolean> {
        return this.post<RefreshToken>(
            '/refresh-token',
            {
                accessToken: this.getToken(),
                refreshToken: this.getToken(),
            },
            true
        ).pipe(
            catchError(() =>

                // Return false
                of(false),
            ),
            map((response: RefreshToken) => {
                // Store the access token in the local storage
                this.authenticateSuccess(response.accessToken);
                // Store the user on the user service
                this._userService.user = response;
                // Return a new observable with the response
                return true
            })
        );
    }

    refreshToken(accessToken: string, refreshToken: string): Observable<RefreshToken> {

        return this.post<RefreshToken>(
            '/refresh-token',
            {
                accessToken,
                refreshToken,
            },
            true
        );
    }



    public isLoggedIn(): boolean {
        if (this._authenticated) {
            return true;
        }
        return false;
    }

    /**
     * Check the authentication status
     */
    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) return of(true);


        if (!this.getToken()) return of(false);
        // Check the access token availability

        if (AuthUtils.isTokenExpired(this.getToken())) {
            console.log('ingreso por token expirado');
            return of(false);
        }
        return this.refreshDataUser();

    }
}


