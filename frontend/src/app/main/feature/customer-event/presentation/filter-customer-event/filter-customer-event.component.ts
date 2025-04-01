import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { FuseConfig, FuseConfigService } from '@fuse/services/config';
import { ChangePaginationModel } from 'app/shared/domain/models/ChangePaginationModel';
import { Subject, takeUntil } from 'rxjs';
import { CustomerEventService } from '../../infrastructure/services/customer-event.service';
import { IReportCustomerEvent } from './report-form.model';

@Component({
    selector: 'ms-filter-customer-event',
    templateUrl: './filter-customer-event.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        FuseDrawerComponent,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule
    ]
})
export class FilterCustomerEventComponent implements OnInit, OnChanges {
    private _formBuilder = inject(FormBuilder);
    private _fuseConfigService = inject(FuseConfigService);
    private _service = inject(CustomerEventService);

    public maxDate: Date = new Date();
    @Input() valuesPagination!: ChangePaginationModel;
    public form: FormGroup;
    public formPagination!: FormGroup;
    public config: FuseConfig;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor() {
        this.form = this._formBuilder.group({
            startDate: [null],
            endDate: [null],
            filterType: [null],
            gender: [null],
        });
        this.formPagination = this._formBuilder.group({
            pageIndex: [0],
            pageSize: [10],
            previousPageIndex: [],
            length: [],
        });
    }

    ngOnInit(): void {
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: FuseConfig) => {
                this.config = config;
            });
    }

    ngOnChanges(): void {
        if (this.valuesPagination != null) {
            this.formPagination.setValue(this.valuesPagination);
            this.onSearch();
        }
    }

    public onSearch(): void {
        const values = this.form.value;
        const valuesPagination = this.formPagination.value;
        const filterValues = new IReportCustomerEvent({
            skip: valuesPagination.pageIndex ?? 0,
            take: valuesPagination.pageSize ?? 10,
            previousPageIndex: valuesPagination.previousPageIndex,
            length: valuesPagination.length,
            startDate: values.startDate ? this.setStartOfDay(new Date(values.startDate)) : null,
            endDate: values.endDate ? this.setEndOfDay(new Date(values.endDate)) : null,
            filterType: values.filterType,
            gender: values.gender,
        });
        this._service.sendFilter(filterValues);
    }

    private setStartOfDay(date: Date): string {
        date.setUTCHours(0, 0, 0, 0);
        return date.toISOString();
    }

    private setEndOfDay(date: Date): string {
        date.setUTCHours(23, 59, 59, 999);
        return date.toISOString();
    }

    clearFilter(): void {
        this.form.reset();
        this.formPagination.reset();
        this.onSearch();
    }
}
