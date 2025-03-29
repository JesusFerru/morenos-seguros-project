import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class HttpServiceNetbase extends HttpService {
    constructor() {
        super();
        this.DOMAIN = environment.apiNetbaseUrl;  // Set the specific domain for "Universal"
    }
}
