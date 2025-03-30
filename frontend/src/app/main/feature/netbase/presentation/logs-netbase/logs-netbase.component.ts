import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { ChangePaginationModel } from 'app/shared/domain/models/ChangePaginationModel';
import { PaginationResponseModel } from 'app/shared/domain/models/PaginationResponseModel';
import { TableComponent } from 'app/shared/presentation/form-components/table/table.component';
import { ViewHeaderComponent } from 'app/shared/presentation/form-components/view-header/view-header.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { CustomerModel } from '../../infrastructure/models/CustomerModel';
import { LogsNetbaseService } from '../../infrastructure/services/netbase.service';
import { FilterNetbaseComponent } from './filter-netbase/filter-netbase.component';
import { IReportNetbase } from './filter-netbase/report-form.model';
import { logsNetbaseTable } from './logs-netbase.config';

@Component({
    selector: 'ms-logs-netbase',
    standalone: true,
    imports: [
        FuseAlertComponent,
        NgIf,
        FilterNetbaseComponent,
        TableComponent,
        CommonModule,
        ViewHeaderComponent,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatTooltipModule,
    ],
    templateUrl: './logs-netbase.component.html',
})
export class LogsNetbaseComponent implements OnInit, OnDestroy {
    _matDialog = inject(MatDialog);
    _activatedRoute = inject(ActivatedRoute);
    _service = inject(LogsNetbaseService);
    _router = inject(Router);

    dropdownOpen: boolean = false;

    columns: Array<any> = logsNetbaseTable;
    data$ = new BehaviorSubject<CustomerModel[]>([]);
    filter$ = new BehaviorSubject<ChangePaginationModel>(null);
    isDownloading: boolean = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    showAlert: boolean = false;
    responsePagination: PaginationResponseModel<CustomerModel>;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    private genderMap: { [key: number]: string } = {
        0: 'Masculino',
        1: 'Femenino',
        2: 'No Binario',
        3: 'Desconocido',
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

    private customerTypeMap: { [key: number]: string } = {
        0: 'Explorador',
        1: 'Investigador',
        2: 'Decidido',
    };

    filter: IReportNetbase;
    public ngOnInit(): void {
        this._service.currentFilter().subscribe((filter: IReportNetbase) => {
            if (filter != null && filter.take > 0) {
                this.filter = filter;
                this.loadData(this.filter);
            }
        });
    }

    ngOnDestroy(): void {
        this._service.clearFilter();
        this.destroy$.next(true);
    }

    loadData(filter: IReportNetbase): void {
        this._service.getListLogsNetbase(filter, this.destroy$).subscribe({
            next: (res) => {
                this.showAlert = false;
                this.responsePagination = res;

                const transformedData = this.responsePagination.data.map(
                    item => ({
                        ...item,
                        createdAt: item.createdAt
                            ? new Date(item.createdAt).toLocaleString('es-ES', {
                                  timeZone: 'America/Caracas',
                              })
                            : '',
                        birthDate: item.birthDate
                            ? new Date(item.birthDate).toLocaleDateString('es-ES', {
                                  timeZone: 'America/Caracas',
                              })
                            : '',
                        gender: this.genderMap[item.gender] || 'Unknown',
                        city: this.cityMap[item.city] || 'Unknown',
                        hasTraveledAbroad: item.hasTraveledAbroad ? 'Sí' : 'No',
                        hasSpecificTravelDate: item.hasSpecificTravelDate
                            ? 'Sí'
                            : 'No',
                        hasSpecificDestination: item.hasSpecificDestination
                            ? 'Sí'
                            : 'No',
                        interestedInTicketsOrPackages:
                            this.packageOptionsMap[
                                item.interestedInTicketsOrPackages
                            ] || 'Unknown',
                        customerType:
                            this.customerTypeMap[item.customerType] || '-',
                        paymentMethod:
                            this.paymentMethodMap[item.paymentMethod] ||
                            'Unknown',
                        attendedEvent: item.attendedEvent ? 'Sí' : 'No',
                        updatedAt: item.updatedAt
                            ? new Date(item.updatedAt).toLocaleString('es-ES', {
                                  timeZone: 'America/Caracas',
                              })
                            : '',
                    }),
                );

                this.data$.next(transformedData);
            },
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error en el listado',
                };
                this.showAlert = true;
            },
        });
    }

    toggleDropdown(): void {
        this.dropdownOpen = !this.dropdownOpen;
    }

    exportNetbaseExcel(): void {
        this.isDownloading = true;

        const currentFilter = this._service.getFilter();

        const filterWithoutPagination = {
            ...currentFilter,
            take: 10000,
            skip: 0,
        };

        this._service.downloadNetbaseExcel(filterWithoutPagination).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = 'Detalle_Registros_Formulario.xlsx';

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

    exportContactsCSV(): void {
        this.isDownloading = true;

        const currentFilter = this._service.getFilter();

        const filterWithoutPagination = {
            ...currentFilter,
            take: 10000,
            skip: 0,
        };

        this._service
            .getListLogsNetbase(filterWithoutPagination, this.destroy$)
            .subscribe({
                next: (res) => {
                    if (!res.data || res.data.length === 0) {
                        console.warn('No hay datos para exportar.');
                        this.isDownloading = false;
                        return;
                    }

                    const contacts = res.data.map(item => [
                        item.name,
                        item.phoneNumber,
                    ]);

                    // Convertir a CSV
                    const csvContent = contacts
                        .map(e => e.join(','))
                        .join('\n');
                    const bom = '\uFEFF'; // Agregar BOM para UTF-8
                    const csvBlob = new Blob([bom + csvContent], {
                        type: 'text/csv;charset=utf-8;',
                    });

                    // Crear y descargar el archivo CSV
                    const url = window.URL.createObjectURL(csvBlob);
                    const anchor = document.createElement('a');
                    anchor.href = url;
                    anchor.download = 'Contactos_Netbase.csv';
                    document.body.appendChild(anchor);
                    anchor.click();
                    window.URL.revokeObjectURL(url);
                    anchor.remove();

                    this.isDownloading = false;
                },
                error: (error) => {
                    console.error('Error descargando el archivo CSV:', error);
                    this.isDownloading = false;
                },
            });
    }

    public changePaginator(event: ChangePaginationModel): void {
        this.filter$.next(event);
    }
}
