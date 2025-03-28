import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpService } from './http.service';


@Injectable({
    providedIn: 'root',
})

export class HttpWeTravelService extends HttpService {
    constructor() {
        super();
        this.DOMAIN = environment.apiWeTravelUrl;  // Set the specific domain for "Next"
    }
}
