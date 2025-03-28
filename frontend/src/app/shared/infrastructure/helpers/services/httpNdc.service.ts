import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class HttpServiceNdc extends HttpService {
    constructor() {
        super();
        this.DOMAIN = environment.apiNdcUrl;  // Set the specific domain for "Ndc"
    }
}
