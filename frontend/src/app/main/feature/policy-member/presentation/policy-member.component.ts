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
import { PolicyMemberService } from '../infrastructure/services/policy-member.service';
import { PolicyMemberModel } from '../infrastructure/models/PolicyMemberModel';
import { CreatePolicyMemberComponent } from './create-policy-member/create-policy-member.component';
import { UpdatePolicyMemberComponent } from './update-policy-member/update-policy-member.component';
import { policyMemberTableConfig } from './policy-member.config';
import { ExcelExportService } from 'app/shared/infrastructure/services/excel-export.service';
import { ExcelExportUtility } from 'app/shared/infrastructure/utils/excel-export.utility';

interface Alert {
    type: 'success' | 'error';
    message: string;
}

@Component({
    selector: 'ms-policy-member',
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
    templateUrl: './policy-member.component.html',
})
export class PolicyMemberComponent implements OnInit, OnDestroy {
    private service = inject(PolicyMemberService);
    private dialog = inject(MatDialog);
    private excelExportService = inject(ExcelExportService);

    public columns = policyMemberTableConfig;
    public data$ = new BehaviorSubject<PolicyMemberModel[]>([]);
    public responsePagination: PaginationResponseModel<PolicyMemberModel>;
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
                    message: 'Error al cargar los miembros de póliza.',
                };
                this.showAlert = true;
            },
        });
    }

    create(): void {
        const dialogRef = this.dialog.open(CreatePolicyMemberComponent, {
            width: '90vw',
            maxWidth: '600px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    edit(member: PolicyMemberModel): void {
        const dialogRef = this.dialog.open(UpdatePolicyMemberComponent, {
            data: { member },
            width: '90vw',
            maxWidth: '600px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadData();
        });
    }

    toggleStatus(member: PolicyMemberModel): void {
        const updated = {
            isTitular: member.isTitular,
            entryDate: member.entryDate,
            status: member.status,
            exclusions: member.exclusions,
            memberType: member.memberType,
            clientId: member.clientId,
            policyId: member.policyId,
            isActive: !member.isActive,
        };

        this.service.update(member.id, updated).subscribe({
            next: () => this.loadData(),
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error al actualizar estado del miembro de póliza.',
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
            'miembros-poliza',
            ExcelExportUtility.COLUMN_MAPPINGS.policyMembers,
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