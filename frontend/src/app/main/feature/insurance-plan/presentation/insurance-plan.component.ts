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
import { InsurancePlanService } from '../infrastructure/services/insurance-plan.service';
import { InsurancePlanModel } from '../infrastructure/models/InsurancePlanModel';
import { CreateInsurancePlanComponent } from './create-insurance-plan/create-insurance-plan.component';
import { UpdateInsurancePlanComponent } from './update-insurance-plan/update-insurance-plan.component';
import { insurancePlanTableConfig } from './insurance-company.config';

interface Alert {
    type: 'success' | 'error';
    message: string;
}

@Component({
    selector: 'ms-insurance-plan',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent,
        ViewHeaderComponent,
        FuseAlertComponent,
        MatIconModule,
        MatSlideToggleModule
    ],
    templateUrl: './insurance-plan.component.html',
})
export class InsurancePlanComponent implements OnInit, OnDestroy {
    private service = inject(InsurancePlanService);
    private dialog = inject(MatDialog);

    public columns = insurancePlanTableConfig;
    public data$ = new BehaviorSubject<InsurancePlanModel[]>([]);
    public responsePagination: PaginationResponseModel<InsurancePlanModel>;
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
                    message: 'Error al cargar los planes de seguro.',
                };
                this.showAlert = true;
            },
        });
    }

    create(): void {
        const dialogRef = this.dialog.open(CreateInsurancePlanComponent, {
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    edit(plan: InsurancePlanModel): void {
        const dialogRef = this.dialog.open(UpdateInsurancePlanComponent, {
            data: { plan },
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    toggleStatus(plan: InsurancePlanModel): void {
        const updated = {
            ...plan,
            isActive: !plan.isActive,
        };

        this.service.update(plan.id, updated).subscribe({
            next: () => this.loadData(),
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error al actualizar estado del plan.',
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
