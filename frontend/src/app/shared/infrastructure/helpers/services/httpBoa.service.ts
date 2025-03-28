import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class HttpServiceBoa extends HttpService {
    constructor() {
        super();
        this.DOMAIN = environment.apiBoaUrl;  // Set the specific domain for "Universal"
    }
}
