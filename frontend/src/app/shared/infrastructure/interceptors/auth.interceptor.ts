import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorModelResponse } from 'app/shared/domain/models/ErrorModelResponse';
import { RefreshToken } from 'app/shared/domain/models/RefreshTokenModel';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthUtils } from '../helpers/auth.utils';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';  // Inyecta el servicio Router

/**
 * Clona la solicitud y actualiza los encabezados con el token de autenticación.
 * @param req La solicitud original.
 * @param authService El servicio de autenticación.
 * @returns La solicitud clonada con los encabezados actualizados.
 */
function cloneAndUpdateHeaders(req: HttpRequest<any>, authService: AuthService): HttpRequest<any> {
  return req.clone({
      headers: req.headers.set(
          'Authorization',
          'Bearer ' + authService.getToken()
      ),
  });
}

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    let isRefreshing = false;
    const authService = inject(AuthService);
    const router = inject(Router); // Inyecta el Router
    const token = authService.getToken();
    let authReq = req;
    if (
        token &&
        !AuthUtils.isTokenExpired(authService.getToken())
    ) {
      authReq = cloneAndUpdateHeaders(req, authService);
    }

    return next(authReq).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 0) && !authReq.url.includes('auth/login')) {
            if (!isRefreshing) {
              isRefreshing = true;
              if (authService.isLoggedIn()) {
                return authService.refreshToken(token, token).pipe(
                  switchMap((toke: RefreshToken) => {
                    isRefreshing = false;
                    authService.authenticateSuccess(toke.accessToken);
                    return next(cloneAndUpdateHeaders(req, authService));
                  }),
                  catchError((refreshError: ErrorModelResponse) => {
                    isRefreshing = false;
                    authService.cleanLocalStorage();
                    router.navigate(['/sign-in']);  // Redirige al login
                    return throwError(() => refreshError);
                  })
                );
              }
            }
          } else {
            return throwError(() => error);
          }
        })
    );
};
