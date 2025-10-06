import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { TableComponent } from 'app/shared/presentation/form-components/table/table.component';
import { ViewHeaderComponent } from 'app/shared/presentation/form-components/view-header/view-header.component';
import { DeductibleOptionService } from '../infrastructure/services/deductible-option.service';
import { DeductibleOptionModel } from '../infrastructure/models/DeductibleOptionModel';
import { PaginationResponseModel } from 'app/shared/domain/models/PaginationResponseModel';
import { ChangePaginationModel } from 'app/shared/domain/models/ChangePaginationModel';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { deductibleOptionTableConfig } from './deductible-option.config';
import { CreateDeductibleOptionComponent } from './create-deductible-option/create-deductible-option.component';
import { UpdateDeductibleOptionComponent } from './update-deductible-option/update-deductible-option.component';
import { ExcelExportService } from 'app/shared/infrastructure/services/excel-export.service';
import { ExcelExportUtility } from 'app/shared/infrastructure/utils/excel-export.utility';

@Component({
    selector: 'ms-deductible-options',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent,
        ViewHeaderComponent,
        FuseAlertComponent,
        MatIconModule,
        MatSlideToggleModule,
        MatButtonModule,
    ],
    templateUrl: './deductible-option.component.html',
})
export class DeductibleOptionComponent implements OnInit, OnDestroy {
    private service = inject(DeductibleOptionService);
    private dialog = inject(MatDialog);
    private excelExportService = inject(ExcelExportService);

    public columns = deductibleOptionTableConfig;
    public data$ = new BehaviorSubject<DeductibleOptionModel[]>([]);
    public responsePagination: PaginationResponseModel<DeductibleOptionModel>;
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
                    message: 'Error al cargar opciones de deducible.',
                };
                this.showAlert = true;
            },
        });
    }

    create(): void {
        const dialogRef = this.dialog.open(CreateDeductibleOptionComponent, {
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    edit(deductible: DeductibleOptionModel): void {
        const dialogRef = this.dialog.open(UpdateDeductibleOptionComponent, {
            data: { deductible },
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    public toggleStatus(deductible: DeductibleOptionModel): void {
        const updated = {
            ...deductible,
            isActive: !deductible.isActive,
        };

        this.service.update(deductible.id, updated).subscribe({
            next: () => this.loadData(),
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error al actualizar deducible.',
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
            'opciones-deducible',
            ExcelExportUtility.COLUMN_MAPPINGS.deductibleOptions,
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
