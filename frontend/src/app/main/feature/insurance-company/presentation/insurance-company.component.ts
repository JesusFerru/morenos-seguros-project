import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { PaginationResponseModel } from 'app/shared/domain/models/PaginationResponseModel';
import { TableComponent } from 'app/shared/presentation/form-components/table/table.component';
import { ViewHeaderComponent } from 'app/shared/presentation/form-components/view-header/view-header.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { InsuranceCompanyService } from '../infrastructure/services/insurance-company.service';
import { insuranceCompanyTableConfig } from './insurance-company.config';
import { InsuranceCompanyModel } from '../infrastructure/models/InsuranceCompanyModel';
import { CreateInsuranceCompanyComponent } from './create-insurance-company/create-insurance-company/create-insurance-company.component';
import { UpdateInsuranceCompanyComponent } from './update-insurance-company/update-insurance-company/update-insurance-company.component';

enum InsuranceCompanyStatus {
    Inactive = 0,
    Active = 1,
}

interface Alert {
    type: 'success' | 'error';
    message: string;
}

@Component({
    selector: 'ms-insurance-company',
    standalone: true,
    imports: [
        ViewHeaderComponent,
        CommonModule,
        TableComponent,
        FuseAlertComponent,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
    ],
    templateUrl: './insurance-company.component.html',
})
export class InsuranceCompanyComponent implements OnInit, OnDestroy {
    private router = inject(Router);
    private userService = inject(InsuranceCompanyService);
    private matDialog = inject(MatDialog);

    public columns = insuranceCompanyTableConfig;
    public data$ = new BehaviorSubject<InsuranceCompanyModel[]>([]);
    public showAlert = false;
    public alert: Alert = { type: 'success', message: '' };
    public isDownloading = false;
    public responsePagination: PaginationResponseModel<InsuranceCompanyModel>;
    private destroy$ = new Subject<boolean>();

    private readonly statusDisplayMap: { [key: string]: string } = {
        'false': 'Inactivo',
        'true': 'Activo',
    };

    ngOnInit(): void {
        this.loadData();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private loadData(): void {
        this.userService.getAll().subscribe({
          next: (res: InsuranceCompanyModel[]) => {
            const transformedData = res.map(user => ({
              ...user,
              status: this.statusDisplayMap[String(user.isActive)] || 'Desconocido',
            }));

            this.responsePagination = {
              totalRecords: transformedData.length,
              data: transformedData as unknown as InsuranceCompanyModel[],
              pageNumber: 1,
              pageSize: transformedData.length,
              totalPages: 1,
            };

            this.data$.next(transformedData as unknown as InsuranceCompanyModel[]);
          },
          error: () => {
            this.alert = {
              type: 'error',
              message: 'Error al cargar las compañías de seguros.',
            };
            this.showAlert = true;
          },
        });
      }


    public createInsuranceCompany(): void {
        const dialogRef = this.matDialog.open(CreateInsuranceCompanyComponent, {
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadData();
            }
        });
    }

    public editInsuranceCompany(user: InsuranceCompanyModel): void {
        const dialogRef = this.matDialog.open(UpdateInsuranceCompanyComponent, {
            data: { user },
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe(updatedUser => {
            if (updatedUser) {
                this.loadData();
            }
        });
    }
}
