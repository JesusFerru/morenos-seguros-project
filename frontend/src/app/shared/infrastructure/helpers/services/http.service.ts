import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Params } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, takeUntil } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    protected DOMAIN: string = '';
    http = inject(HttpClient);
    spinner = inject(NgxSpinnerService);

    private hideSpinnerWithTimeout(
        showSpinner: boolean,
        seconds: number = 250
    ): void {
        if (showSpinner) {
            setTimeout(() => {
                this.spinner.hide();
            }, seconds);
        }
    }

    private _executeApi<T>(api: any, showSpinner: boolean, cancel$?: Observable<boolean>): Observable<T> {
        if (showSpinner) {
            this.spinner.show();
        }
        const apiObservable = cancel$ ? api.pipe(takeUntil(cancel$)) : api;

        return new Observable((observer) => {
            apiObservable.subscribe({
                next: (response: T) => {
                    observer.next(response);
                    this.hideSpinnerWithTimeout(showSpinner);
                },
                error: (response: HttpErrorResponse) => {
                    // this.toastrService.error(response.error);
                    observer.error(response.error);
                    this.hideSpinnerWithTimeout(showSpinner);
                },
                complete: () => {
                    observer.complete();
                    this.hideSpinnerWithTimeout(showSpinner);
                },
            });
            return {
                unsubscribe() { },
            };
        });
    }

    protected get<T>(url: string, cancel$?: Observable<boolean>): Observable<T> {
        return this._executeApi(
            this.http.get(this.DOMAIN + url, httpOptions),
            true, cancel$
        );
    }

    protected getDownload<T>(url: string, params: HttpParams, cancel$?: Observable<boolean>): Observable<T> {
        return this._executeApi(
            this.http.get(this.DOMAIN + url, {
                headers: httpOptions.headers,
                params: params,
                responseType: 'blob'
            }),
            true, cancel$
        );
    }

    protected getByFilet<T>(url: string, sendParams: Params, cancel$?: Observable<boolean>): Observable<T> {
        return this._executeApi(
            this.http.get(this.DOMAIN + url, {
                params: sendParams,
                headers: httpOptions.headers,
            }),
            true, cancel$
        );
    }

    protected post<T>(
        url: string,
        form: any,
        showError: boolean = true
    ): Observable<T> {
        const formData = form;

        return this._executeApi(
            this.http.post(this.DOMAIN + url, formData, httpOptions),
            showError
        );
    }

    protected put<T>(
        url: string,
        form: any,
        showError: boolean = true
    ): Observable<T> {
        //const formData = this.convertToFormData(form);
        const formData = form;
        return this._executeApi(
            this.http.put(this.DOMAIN + url, formData, httpOptions),
            showError
        );
    }

    protected delete<T>(url: string): Observable<T> {
        return this._executeApi(
            this.http.delete(this.DOMAIN + url, httpOptions),
            true
        );
    }
}
