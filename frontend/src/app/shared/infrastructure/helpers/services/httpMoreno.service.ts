import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class HttpServiceMoreno extends HttpService {
    constructor() {
        super();
        this.DOMAIN = environment.apiMorenoUrl;
    }
}
