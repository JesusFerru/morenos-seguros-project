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
import { PaymentService } from '../infrastructure/services/payment.service';
import { PaymentModel } from '../infrastructure/models/PaymentModel';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { UpdatePaymentComponent } from './update-payment/update-payment.component';
import { paymentTableConfig } from './payment.config';

interface Alert {
    type: 'success' | 'error';
    message: string;
}

@Component({
    selector: 'ms-payment',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent,
        ViewHeaderComponent,
        FuseAlertComponent,
        MatIconModule,
        MatSlideToggleModule
    ],
    templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit, OnDestroy {
    private service = inject(PaymentService);
    private dialog = inject(MatDialog);

    public columns = paymentTableConfig;
    public data$ = new BehaviorSubject<PaymentModel[]>([]);
    public responsePagination: PaginationResponseModel<PaymentModel>;
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
                    message: 'Error al cargar los pagos.',
                };
                this.showAlert = true;
            },
        });
    }

    create(): void {
        const dialogRef = this.dialog.open(CreatePaymentComponent, {
            width: '90vw',
            maxWidth: '600px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    edit(payment: PaymentModel): void {
        const dialogRef = this.dialog.open(UpdatePaymentComponent, {
            data: { payment },
            width: '90vw',
            maxWidth: '600px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    toggleStatus(payment: PaymentModel): void {
        const updated = {
            policyNumber: payment.policyNumber,
            paymentDate: payment.paymentDate,
            period: payment.period,
            paymentMethod: payment.paymentMethod,
            amount: payment.amount,
            receiptUrl: payment.receiptUrl,
            isActive: !payment.isActive,
        };

        this.service.update(payment.id, updated).subscribe({
            next: () => this.loadData(),
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error al actualizar estado del pago.',
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