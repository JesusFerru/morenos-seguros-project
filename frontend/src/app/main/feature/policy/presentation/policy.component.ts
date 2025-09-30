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
import { PolicyService } from '../infrastructure/services/policy.service';
import { PolicyModel } from '../infrastructure/models/PolicyModel';
import { CreatePolicyComponent } from './create-policy/create-policy.component';
import { policyTableConfig } from './policy.config';
import { UpdatePolicyComponent } from './update-policy/update-policy.component';

interface Alert {
    type: 'success' | 'error';
    message: string;
}

@Component({
    selector: 'ms-policy',
    standalone: true,
    imports: [
        CommonModule,
        TableComponent,
        ViewHeaderComponent,
        FuseAlertComponent,
        MatIconModule,
        MatSlideToggleModule
    ],
    templateUrl: './policy.component.html',
})
export class PolicyComponent implements OnInit, OnDestroy {
    private service = inject(PolicyService);
    private dialog = inject(MatDialog);

    public columns = policyTableConfig;
    public data$ = new BehaviorSubject<PolicyModel[]>([]);
    public responsePagination: PaginationResponseModel<PolicyModel>;
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
            next: (policies: PolicyModel[]) => {
                const mapped = policies.map(p => ({
                    ...p,
                }));

                this.responsePagination = {
                    totalRecords: mapped.length,
                    data: policies,
                    pageNumber: 1,
                    pageSize: mapped.length,
                    totalPages: 1,
                };

                this.data$.next(mapped);
            },
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error al cargar las pólizas.',
                };
                this.showAlert = true;
            },
        });
    }

    create(): void {
        const dialogRef = this.dialog.open(CreatePolicyComponent, {
            width: '600px',
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadData();
                this.showAlert = true;
                this.alert = {
                    type: 'success',
                    message: 'Póliza creada exitosamente.',
                };
            }
        });
    }

    edit(policy: PolicyModel): void {
        const dialogRef = this.dialog.open(UpdatePolicyComponent, {
            width: '600px',
            disableClose: true,
            data: { policy },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadData();
                this.showAlert = true;
                this.alert = {
                    type: 'success',
                    message: 'Póliza actualizada exitosamente.',
                };
            }
        });
    }

    toggleStatus(policy: PolicyModel): void {
        const updatedPolicy = { ...policy, isActive: !policy.isActive };
        
        this.service.update(policy.id, updatedPolicy).subscribe({
            next: () => {
                this.loadData();
                this.showAlert = true;
                this.alert = {
                    type: 'success',
                    message: `Póliza ${updatedPolicy.isActive ? 'activada' : 'desactivada'} exitosamente.`,
                };
            },
            error: () => {
                this.showAlert = true;
                this.alert = {
                    type: 'error',
                    message: 'Error al actualizar el estado de la póliza.',
                };
            },
        });
    }

    onPaginationChange(event: ChangePaginationModel): void {
        // Implement pagination if needed
        this.loadData();
    }
}
