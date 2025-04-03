import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { ChangePaginationModel } from 'app/shared/domain/models/ChangePaginationModel';
import { PaginationResponseModel } from 'app/shared/domain/models/PaginationResponseModel';
import { TableComponent } from 'app/shared/presentation/form-components/table/table.component';
import { ViewHeaderComponent } from 'app/shared/presentation/form-components/view-header/view-header.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EventService } from '../../event/infrastructure/services/event.service';
import { CustomerEventModel } from '../infrastructure/models/CustomerEventModel';
import { CustomerEventService } from '../infrastructure/services/customer-event.service';
import { CustomerEventTable } from './customer-event.config';
import { FilterCustomerEventComponent } from './filter-customer-event/filter-customer-event.component';

@Component({
    selector: 'ms-customer-event',
    templateUrl: './customer-event.component.html',
    standalone: true,
    imports: [
        FuseAlertComponent,
        TableComponent,
        ViewHeaderComponent,
        FilterCustomerEventComponent,
        MatFormFieldModule,
        MatSelectModule,
        CommonModule,
        MatTooltipModule,
        MatIconModule,
        MatAutocompleteModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
})
export class CustomerEventComponent implements OnInit, OnDestroy {
    private _service = inject(CustomerEventService);
    private _eventService = inject(EventService);

    public columns: Array<any> = CustomerEventTable;
    public data$ = new BehaviorSubject<CustomerEventModel[]>([]);
    public filter$ = new BehaviorSubject<ChangePaginationModel>(null);
    public showAlert: boolean = false;
    public isDownloading: boolean = false;
    public alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    public responsePagination: PaginationResponseModel<CustomerEventModel>;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    public events: any[] = [];
    public selectedEvent: string | null = null;

    public eventSearchCtrl: FormControl = new FormControl();
    public filteredEvents: any[] = [];

    private genderMap: { [key: number]: string } = {
        0: 'Masculino',
        1: 'Femenino',
        2: 'No Binario',
        3: 'Desconocido',
    };

    private customerTypeMap: { [key: number]: string } = {
        0: 'Explorador',
        1: 'Investigador',
        2: 'Decidido',
    };

    private cityMap: { [key: number]: string } = {
        0: 'Santa Cruz',
        1: 'Cochabamba',
        2: 'La Paz',
        3: 'Oruro',
    };

    private packageOptionsMap: { [key: number]: string } = {
        0: 'Boletos',
        1: 'Ofertas',
        2: 'Ambos',
    };

    private paymentMethodMap: { [key: number]: string } = {
        0: 'Qr',
        1: 'Tarjeta de Crédito',
        2: 'Efectivo',
    };

    filter: any;

    ngOnInit(): void {
        this._eventService.getAll().subscribe({
            next: (data) => {
                this.events = data;
                this.filteredEvents = data;
                this.eventSearchCtrl.valueChanges
                    .pipe(
                        startWith(''),
                        map(value =>
                            typeof value === 'string'
                                ? value.toLowerCase()
                                : value?.name.toLowerCase() || '',
                        ),
                    )
                    .subscribe((searchText) => {
                        this.filteredEvents = this.events.filter(event =>
                            event.name.toLowerCase().includes(searchText),
                        );
                    });
            },
            error: (err) => {
                console.error('Error al cargar eventos', err);
            },
        });

        this._service.currentFilter().subscribe((filter) => {
            if (filter != null && filter.take > 0) {
                this.filter = filter;
                if (this.selectedEvent) {
                    this.filter.eventId = this.selectedEvent;
                }
                this.loadData(this.filter);
            }
        });
    }

    ngOnDestroy(): void {
        this._service.clearFilter();
        this.destroy$.next(true);
    }

    displayEvent(event: any): string {
        return event && event.name ? event.name : '';
    }

    onEventSelected(event: any): void {
        this.selectedEvent = event.id;
        this.eventSearchCtrl.setValue(event);
        const currentFilter = this._service.getFilter();
        currentFilter.eventId = event.id;
    }

    loadData(filter: any): void {
        if (!filter.filterType) {
            this.data$.next([]);
            return;
        }

        filter.eventId = this.selectedEvent;

        this.updateTableColumns();

        this._service
            .getListCustomerEventLogs(filter, this.destroy$)
            .subscribe({
                next: (res) => {
                    this.showAlert = false;
                    this.responsePagination = res;

                    const transformedData: CustomerEventModel[] =
                        this.responsePagination.data.map(item => ({
                            ...item,
                            event: item.event?.name || '',
                            birthDate: item.birthDate
                                ? new Date(item.birthDate).toLocaleDateString(
                                      'es-ES',
                                      { timeZone: 'America/Caracas' },
                                  )
                                : '',
                            standAssignmentDate: item.standAssignmentDate
                                ? new Date(
                                      item.standAssignmentDate,
                                  ).toLocaleString('es-ES', {
                                      timeZone: 'America/Caracas',
                                  })
                                : '',
                            regIngress: item.regIngress?.fullName || '',
                            concierge: item.concierge?.fullName || '',
                            stand: item.stand?.name || '',
                            origin: item.origin?.name || '',
                            onlineRegistrationDate: item.onlineRegistrationDate
                                ? new Date(
                                      item.onlineRegistrationDate,
                                  ).toLocaleString('es-ES', {
                                      timeZone: 'America/Caracas',
                                  })
                                : '',
                            entryDate: item.entryDate
                                ? new Date(item.entryDate).toLocaleString(
                                      'es-ES',
                                      { timeZone: 'America/Caracas' },
                                  )
                                : '',
                            onsiteRegistrationDate: item.onsiteRegistrationDate
                                ? new Date(
                                      item.onsiteRegistrationDate,
                                  ).toLocaleString('es-ES', {
                                      timeZone: 'America/Caracas',
                                  })
                                : '',
                            hasTraveledAbroad: item.hasTraveledAbroad ?? false,
                            hasSpecificTravelDate:
                                item.hasSpecificTravelDate ?? false,
                            hasSpecificDestination:
                                item.hasSpecificDestination ?? false,
                            gender:
                                this.genderMap[item.gender] || 'Desconocido',
                            city: this.cityMap[item.city] || 'Desconocido',
                            archetype:
                                this.customerTypeMap[
                                    item.archetype
                                ] || 'Desconocido',
                            ticketOrPackageInterest:
                                this.packageOptionsMap[
                                    item.ticketOrPackageInterest
                                ] || 'Desconocido',
                            paymentMethod:
                                this.paymentMethodMap[item.paymentMethod] ||
                                'Desconocido',
                        }));

                    this.data$.next(transformedData);
                },
                error: () => {
                    this.alert = {
                        type: 'error',
                        message: 'Error al cargar los registros',
                    };
                    this.showAlert = true;
                },
            });
    }

    downloadCustomerEventExcel(): void {
        this.isDownloading = true;
        const currentFilter = this._service.getFilter();
        const filterWithoutPagination = {
            ...currentFilter,
            take: 10000,
            skip: 0,
        };
        this._service
            .downloadCustomerEventExcel(filterWithoutPagination)
            .subscribe({
                next: (blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const anchor = document.createElement('a');
                    anchor.href = url;
                    anchor.download = 'Detalle_Clientes_Evento.xlsx';
                    document.body.appendChild(anchor);
                    anchor.click();
                    window.URL.revokeObjectURL(url);
                    anchor.remove();
                    this.isDownloading = false;
                },
                error: (error) => {
                    console.error('Error downloading the file:', error);
                    this.isDownloading = false;
                },
            });
    }

    public changePaginator(event: ChangePaginationModel): void {
        this.filter$.next(event);
    }

    private updateTableColumns(): void {
        if (this.filter && this.filter.filterType) {
            if (this.filter.filterType === 'preregistered') {
                this.columns = CustomerEventTable.filter(
                    col =>
                        col.columnDef !== 'onsiteRegistrationDate' &&
                        col.columnDef !== 'entryDate',
                );
            } else if (this.filter.filterType === 'entered') {
                this.columns = CustomerEventTable.filter(
                    col => col.columnDef !== 'onlineRegistrationDate',
                );
            } else {
                this.columns = CustomerEventTable;
            }
        }
    }
}
