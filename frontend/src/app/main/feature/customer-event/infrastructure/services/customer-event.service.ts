import { Injectable } from '@angular/core';
import { PaginationResponseModel } from 'app/shared/domain/models/PaginationResponseModel';
import { QueryParamsUtils } from 'app/shared/infrastructure/helpers/query-params.utils';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IReportCustomerEvent } from '../../presentation/filter-customer-event/report-form.model';
import { CustomerEventModel } from '../models/CustomerEventModel';

@Injectable({
    providedIn: 'root',
})
export class CustomerEventService extends HttpServiceMoreno {
    private readonly endpoint = '/customerevents';
    private filter$ = new BehaviorSubject<IReportCustomerEvent>(
        new IReportCustomerEvent(),
    );

    public getListCustomerEventLogs(
        filter: IReportCustomerEvent,
        cancel$?: Observable<boolean>,
    ): Observable<PaginationResponseModel<CustomerEventModel>> {
        const params = QueryParamsUtils.buildQueryString(filter);
        return this.getByFilet<PaginationResponseModel<CustomerEventModel>>(
            `${this.endpoint}/logs`,
            params,
            cancel$,
        );
    }

    public downloadCustomerEventExcel(
        filter: IReportCustomerEvent,
    ): Observable<Blob> {
        const params = QueryParamsUtils.buildQueryString(filter);
        return this.getDownload(`${this.endpoint}/logs/export`, params);
    }

    public currentFilter(): Observable<IReportCustomerEvent> {
        return this.filter$.asObservable();
    }

    public sendFilter(filter: IReportCustomerEvent): void {
        this.filter$.next(filter);
    }

    public getFilter(): IReportCustomerEvent {
        return this.filter$.getValue();
    }

    public clearFilter(): void {
        this.filter$.next(new IReportCustomerEvent());
    }
}
