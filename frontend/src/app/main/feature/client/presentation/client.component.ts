import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { FuseAlertComponent } from '@fuse/components/alert';
import { CommonModule } from '@angular/common';
import { TableComponent } from 'app/shared/presentation/form-components/table/table.component';
import { ViewHeaderComponent } from 'app/shared/presentation/form-components/view-header/view-header.component';
import { PaginationResponseModel } from 'app/shared/domain/models/PaginationResponseModel';
import { ChangePaginationModel } from 'app/shared/domain/models/ChangePaginationModel';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClientService } from '../infrastructure/services/client.service';
import { ClientModel } from '../infrastructure/models/ClientModel';
import { CreateClientComponent } from './create-client/create-client.component';
import { clientTableConfig } from './client.config';
import { UpdateClientComponent } from './update-client/update-client.component';

interface Alert {
    type: 'success' | 'error';
    message: string;
}

@Component({
    selector: 'ms-client',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent,
        ViewHeaderComponent,
        FuseAlertComponent,
        MatIconModule,
        MatSlideToggleModule
    ],
    templateUrl: './client.component.html',
})
export class ClientComponent implements OnInit, OnDestroy {
    private service = inject(ClientService);
    private dialog = inject(MatDialog);

    public columns = clientTableConfig;
    public data$ = new BehaviorSubject<ClientModel[]>([]);
    public responsePagination: PaginationResponseModel<ClientModel>;
    public showAlert = false;
    public alert: Alert = { type: 'success', message: '' };
    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.loadData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadData(): void {
        this.service.getAll().subscribe({
            next: (res) => {
                this.responsePagination = {
                    totalRecords: res.length,
                    data: res,
                    pageNumber: 1,
                    pageSize: res.length,
                    totalPages: 1,
                };
                this.data$.next(res);
            },
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error al cargar los clientes.',
                };
                this.showAlert = true;
            },
        });
    }

    create(): void {
        const dialogRef = this.dialog.open(CreateClientComponent, {
            width: '90vw',
            maxWidth: '600px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    edit(client: ClientModel): void {
        const dialogRef = this.dialog.open(UpdateClientComponent, {
            data: { client },
            width: '90vw',
            maxWidth: '600px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    toggleStatus(client: ClientModel): void {
        const updated = {
            firstName: client.firstName,
            lastName: client.lastName,
            birthDate: client.birthDate,
            nit: client.nit,
            businessName: client.businessName,
            email: client.email,
            phoneNumber: client.phoneNumber,
            documentType: client.documentType,
            documentNumber: client.documentNumber,
            city: client.city,
            address: client.address,
            employmentStatus: client.employmentStatus,
            fundOrigin: client.fundOrigin,
            incomeRange: client.incomeRange,
            isActive: !client.isActive,
        };

        this.service.update(client.id, updated).subscribe({
            next: () => this.loadData(),
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error al actualizar estado del cliente.',
                };
                this.showAlert = true;
            },
        });
    }

    onPageChanged(event: ChangePaginationModel): void {
        const data = this.responsePagination?.data ?? [];
        const start = event.pageIndex * event.pageSize;
        const end = start + event.pageSize;
        const paginated = data.slice(start, end);
        this.data$.next(paginated);
    }
}