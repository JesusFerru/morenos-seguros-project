import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { FuseConfig, FuseConfigService } from '@fuse/services/config';
import { ChangePaginationModel } from 'app/shared/domain/models/ChangePaginationModel';
import { Subject, takeUntil } from 'rxjs';
import { LogsNetbaseService } from '../../../infrastructure/services/netbase.service';
import { IReportNetbase } from './report-form.model';

@Component({
    selector: 'tt-filter-netbase',
    standalone: true,
    imports: [MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        FuseDrawerComponent,
        MatIconModule,
        MatButtonModule,
        NgFor,
        MatTooltipModule,
        MatAutocompleteModule,
        MatSlideToggleModule,
        CommonModule,],
    templateUrl: './filter-netbase.component.html',
    providers: [provideNativeDateAdapter()]
})
export class FilterNetbaseComponent implements OnInit, OnChanges {
    _formBuilder = inject(FormBuilder);
    _fuseConfigService = inject(FuseConfigService);
    _service = inject(LogsNetbaseService);

    public maxDate: Date = new Date();
    @Input() valuesPagination!: ChangePaginationModel;

    public form: FormGroup;
    public formPagination!: FormGroup;
    config: FuseConfig;

    public customerTypeOptions = [
        { label: 'Explorador', value: '0' },
        { label: 'Investigador', value: '1' },
        { label: 'Decidido', value: '2' },
        { label: 'Desconocido', value: '3' }
    ];


    public genderOptions = [
        { label: 'Masculino', value: '0' },
        { label: 'Femenino', value: '1' },
        { label: 'No Binario', value: '2' },
        { label: 'Desconocido', value: '3' }
    ];

    public cityOptions = [
        { label: 'Santa Cruz', value: '0' },
        { label: 'Cochabamba', value: '1' },
        { label: 'La Paz', value: '2' },
        { label: 'Oruro', value: '3' }
    ];

    public packageMulOptions = [
        { label: 'Boletos', value: '0' },
        { label: 'Ofertas', value: '1' },
        { label: 'Ambos', value: '2' }
    ];

    public paymentMethodOptions = [
        { label: 'Qr', value: '0' },
        { label: 'Tarjeta de Crédito', value: '1' },
        { label: 'Efectivo', value: '2' }
    ];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    public ngOnInit(): void {
        // Subscribe to config changes
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: FuseConfig) => {
                // Store the config
                this.config = config;
            });

        this.form = this._formBuilder.group({
            startDate: [null],
            endDate: [null],
            documentNumber: [null],
            customerType: [null],
            gender: [null],
            city: [null],
            packageOptions: [null],
            paymentMethod: [null],
            sourceUrl: [null]
        });
        this.formPagination = this._formBuilder.group({
            pageIndex: [0],
            pageSize: [10],
            previousPageIndex: [],
            length: [],
        });

    }


    ngOnChanges(): void {
        if (this.valuesPagination != null) {
            if (this.valuesPagination) {
                this.formPagination.setValue(this.valuesPagination);
            }
            this.onSearch();
        }
    }

    public onSearch(): void {
        const values = this.form.value;
        const valuesPagination = this.formPagination.value;

        const filterValues = new IReportNetbase({
            skip: valuesPagination.pageIndex ?? 0,
            take: valuesPagination.pageSize ?? 10,
            previousPageIndex: valuesPagination.previousPageIndex,
            length: valuesPagination.length,
            startDate: values.startDate
                ? this.setStartOfDay(new Date(values.startDate))
                : null,
            endDate: values.endDate
                ? this.setEndOfDay(new Date(values.endDate))
                : null,
            documentNumber: values.documentNumber,
            customerType: values.customerType,
            gender: values.gender,
            city: values.city,
            packageOptions: values.packageOptions,
            paymentMethod: values.paymentMethod,
            sourceURL: values.sourceUrl
        });

        this._service.sendFilter(filterValues);
    }

    private setStartOfDay(date: Date): string {
        date.setUTCHours(0, 0, 0, 0); // Configura la hora a 00:00:00.000 en UTC
        return date.toISOString();
    }

    private setEndOfDay(date: Date): string {
        date.setUTCHours(23, 59, 59, 999); // Configura la hora a 23:59:59.999 en UTC
        return date.toISOString();
    }



    transform(value: string): string {
        const datePipe = new DatePipe('en-US');
        value = datePipe.transform(value, 'MM/dd/yyyy');
        return value;
    }

    clearFilter(): void {
        this.form.reset();
        this.formPagination.reset();
        this.onSearch();
    }

}
