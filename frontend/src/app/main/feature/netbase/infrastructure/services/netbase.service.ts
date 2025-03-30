import { Injectable } from '@angular/core';
import { PaginationResponseModel } from 'app/shared/domain/models/PaginationResponseModel';
import { QueryParamsUtils } from 'app/shared/infrastructure/helpers/query-params.utils';
import { HttpServiceMoreno } from 'app/shared/infrastructure/helpers/services/httpMoreno.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IExportNetbase } from '../../presentation/logs-netbase/filter-netbase/export-form.model';
import { IReportNetbase } from '../../presentation/logs-netbase/filter-netbase/report-form.model';
import { CustomerModel } from '../models/CustomerModel';

@Injectable({
    providedIn: 'root',
})
export class LogsNetbaseService extends HttpServiceMoreno {
    private filter$ = new BehaviorSubject<IReportNetbase>(
        new IReportNetbase(),
    );

    private exportFilter$ = new BehaviorSubject<IExportNetbase>(
        new IExportNetbase(),
    );

    public getListLogsNetbase(
        filter: IReportNetbase,
        cancel$?: Observable<boolean>,
    ): Observable<PaginationResponseModel<CustomerModel>> {
        const params = QueryParamsUtils.buildQueryString(filter);
        return this.getByFilet<PaginationResponseModel<CustomerModel>>(
            '/customers/logs',
            params,
            cancel$,
        );
    }

    public downloadNetbaseExcel(
        filter: IReportNetbase,
    ): Observable<Blob> {
        const params = QueryParamsUtils.buildQueryString(filter);
        return this.getDownload('/customer/logs/export', params);
    }


    public currentFilter(): Observable<IReportNetbase> {
        return this.filter$.asObservable();
    }

    public sendFilter(filter: IReportNetbase): void {
        this.filter$.next(filter);
    }

    public getFilter(): IExportNetbase {
        return this.filter$.getValue();
    }

    public getExportFilter(): IExportNetbase {
        return this.exportFilter$.getValue();
    }

    public sendExportFilter(filter: IExportNetbase): void {
        this.exportFilter$.next(filter);
    }

    public clearExportFilter(): void {
        this.exportFilter$ = new BehaviorSubject<IExportNetbase>(
            new IExportNetbase(),
        );
    }

    public currentExportFilter(): Observable<IExportNetbase> {
        return this.exportFilter$.asObservable();
    }

    public clearFilter(): void {
        this.filter$ = new BehaviorSubject<IReportNetbase>(
            new IReportNetbase(),
        );
    }
}
