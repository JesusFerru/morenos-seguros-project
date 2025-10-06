import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { FuseAlertComponent } from '@fuse/components/alert';
import { CommonModule } from '@angular/common';
import { TableComponent } from 'app/shared/presentation/form-components/table/table.component';
import { ViewHeaderComponent } from 'app/shared/presentation/form-components/view-header/view-header.component';
import { InsuranceCompanyService } from '../infrastructure/services/insurance-company.service';
import { InsuranceCompanyModel } from '../infrastructure/models/InsuranceCompanyModel';
import { insuranceCompanyTableConfig } from './insurance-company.config';
import { PaginationResponseModel } from 'app/shared/domain/models/PaginationResponseModel';
import { ChangePaginationModel } from 'app/shared/domain/models/ChangePaginationModel';
import { CreateInsuranceCompanyComponent } from './create-insurance-company/create-insurance-company/create-insurance-company.component';
import { UpdateInsuranceCompanyComponent } from './update-insurance-company/update-insurance-company/update-insurance-company.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { ExcelExportService } from 'app/shared/infrastructure/services/excel-export.service';
import { ExcelExportUtility } from 'app/shared/infrastructure/utils/excel-export.utility';

interface Alert {
    type: 'success' | 'error';
    message: string;
}

@Component({
    selector: 'ms-insurance-company',
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
    templateUrl: './insurance-company.component.html',
})
export class InsuranceCompanyComponent implements OnInit, OnDestroy {
    private service = inject(InsuranceCompanyService);
    private dialog = inject(MatDialog);
    private excelExportService = inject(ExcelExportService);

    public columns = insuranceCompanyTableConfig;
    public data$ = new BehaviorSubject<InsuranceCompanyModel[]>([]);
    public responsePagination: PaginationResponseModel<InsuranceCompanyModel>;
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
                    message: 'Error al cargar las compañías de seguro.',
                };
                this.showAlert = true;
            },
        });
    }

    create(): void {
        const dialogRef = this.dialog.open(CreateInsuranceCompanyComponent, {
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    edit(company: InsuranceCompanyModel): void {
        const dialogRef = this.dialog.open(UpdateInsuranceCompanyComponent, {
            data: { company },
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    public toggleStatus(insurancecompany: InsuranceCompanyModel): void {
        const updated = {
            ...insurancecompany,
            isActive: !insurancecompany.isActive,
        };

        this.service.update(insurancecompany.id, updated).subscribe({
            next: () => this.loadData(),
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error al actualizar estado.',
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
            'companias-aseguradoras',
            ExcelExportUtility.COLUMN_MAPPINGS.companies,
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
