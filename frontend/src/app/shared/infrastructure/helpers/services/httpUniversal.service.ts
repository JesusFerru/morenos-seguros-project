import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpService } from "./http.service";

@Injectable({
    providedIn: 'root',
})
export class HttpServiceUniversal extends HttpService {
    constructor() {
        super();
        this.DOMAIN = environment.apiUniversalAssistaUrl;  // Set the specific domain for "Universal"
    }
}
