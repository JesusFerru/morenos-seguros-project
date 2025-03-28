import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassifierModel } from '../../domain/models/ClassifierModel';
import { ClassifierStringModel } from '../../domain/models/ClassifierStringModel';
import { HttpServiceNext } from '../helpers/services/httpNext.service';

@Injectable({
    providedIn: 'root',
})
export class ClassifierServiceService extends HttpServiceNext {

    public getStatusF01(): Observable<ClassifierModel[]> {
        return this.get<ClassifierModel[]>(
            '/status-f01'
        );
    }

    public getMethodPayment(): Observable<ClassifierModel[]> {
        return this.get<ClassifierModel[]>(
            '/code-method-payment'
        );
    }

    public getStatusMethodPayment(): Observable<ClassifierStringModel[]> {
        return this.get<ClassifierStringModel[]>(
            '/status-method-payment'
        );
    }

    public getCurrency(): Observable<ClassifierStringModel[]> {
        return this.get<ClassifierStringModel[]>(
            '/currency'
        );

    }

}
