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
import { MatButtonModule } from '@angular/material/button';
import { BankService } from '../infrastructure/services/bank.service';
import { BankAccountModel } from '../infrastructure/models/BankAccountModel';
import { CreateBankComponent } from './create-bank/create-bank.component';
import { bankTableConfig } from './bank.config';
import { UpdateBankComponent } from './update-bank/update-bank.component';
import { ExcelExportService } from 'app/shared/infrastructure/services/excel-export.service';
import { ExcelExportUtility } from 'app/shared/infrastructure/utils/excel-export.utility';

interface Alert {
    type: 'success' | 'error';
    message: string;
}

@Component({
    selector: 'ms-bank',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent,
        ViewHeaderComponent,
        FuseAlertComponent,
        MatIconModule,
        MatSlideToggleModule,
        MatButtonModule
    ],
    templateUrl: './bank.component.html',
})
export class BankComponent implements OnInit, OnDestroy {
    private service = inject(BankService);
    private dialog = inject(MatDialog);
    private excelExportService = inject(ExcelExportService);

    public columns = bankTableConfig;
    public data$ = new BehaviorSubject<BankAccountModel[]>([]);
    public responsePagination: PaginationResponseModel<BankAccountModel>;
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
                    message: 'Error al cargar las cuentas bancarias.',
                };
                this.showAlert = true;
            },
        });
    }

    create(): void {
        const dialogRef = this.dialog.open(CreateBankComponent, {
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    edit(account: BankAccountModel): void {
        const dialogRef = this.dialog.open(UpdateBankComponent, {
            data: { account },
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    toggleStatus(account: BankAccountModel): void {
        const updated = {
            bank: account.bank,
            accountType: account.accountType,
            accountNumber: account.accountNumber,
            currency: account.currency,
            holderName: account.holderName,
            isActive: !account.isActive,
        };

        this.service.update(account.id, updated).subscribe({
            next: () => this.loadData(),
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error al actualizar estado de la cuenta bancaria.',
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

    exportToExcel(): void {
        const data = this.responsePagination?.data ?? [];
        
        ExcelExportUtility.exportToExcel(
            data,
            'cuentas-bancarias',
            ExcelExportUtility.COLUMN_MAPPINGS.banks,
            this.excelExportService,
            (message: string) => {
                this.alert = { type: 'success', message };
                this.showAlert = true;
            },
            (message: string) => {
                this.alert = { type: 'error', message };
                this.showAlert = true;
            }
        );
    }
}