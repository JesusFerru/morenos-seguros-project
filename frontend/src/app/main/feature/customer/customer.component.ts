import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { TableComponent } from 'app/shared/presentation/form-components/table/table.component';
import { ViewHeaderComponent } from 'app/shared/presentation/form-components/view-header/view-header.component';

import { PaginationResponseModel } from 'app/shared/domain/models/PaginationResponseModel';
import { ChangePaginationModel } from 'app/shared/domain/models/ChangePaginationModel';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CustomerService } from './infrastructure/services/customer.service';
import { customerTableConfig } from './customer.config';
import { CustomerModel } from './infrastructure/models/CustomerModel';
import { UpdateCustomerComponent } from './presentation/update-customer/update-customer.component';
import { CreateCustomerComponent } from './presentation/create-customer/create-customer.component';


@Component({
    selector: 'ms-customer',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent,
        ViewHeaderComponent,
        FuseAlertComponent,
        MatIconModule,
        MatSlideToggleModule,
    ],
    templateUrl: './customer.component.html',
})
export class CustomerComponent implements OnInit, OnDestroy {
    private service = inject(CustomerService);
    private dialog = inject(MatDialog);

    public columns = customerTableConfig;
    public data$ = new BehaviorSubject<CustomerModel[]>([]);
    public responsePagination: PaginationResponseModel<CustomerModel>;
    public showAlert = false;
    public alert: { type: 'success' | 'error'; message: string } = {
        type: 'success',
        message: '',
    };
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
                    message: 'Error al cargar clientes.',
                };
                this.showAlert = true;
            },
        });
    }

    create(): void {
        const dialogRef = this.dialog.open(CreateCustomerComponent, {
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    edit(customer: CustomerModel): void {
        const dialogRef = this.dialog.open(UpdateCustomerComponent, {
            data: { customer },
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    public toggleStatus(client: CustomerModel): void {
        const updated = {
            ...client,
            isActive: !client.isActive,
        };

        this.service.update(client.id, updated).subscribe({
            next: () => this.loadData(),
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error al actualizar cliente.',
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
