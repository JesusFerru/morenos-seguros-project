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
import { StandModel } from '../infrastructure/models/StandModel';
import { StandService } from '../infrastructure/services/stand.service';
import { CreateStandModalComponent } from './create-stand/create-stand.component';
import { ConfirmDeleteStandModalComponent } from './delete-stand/delete-stand.component';
import { standTableConfig } from './stand.config';
import { UpdateStandModalComponent } from './update-stand/update-stand.component';

@Component({
    selector: 'tt-stands',
    standalone: true,
    imports: [
        ViewHeaderComponent,
        CommonModule,
        TableComponent,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
        FuseAlertComponent
    ],
    templateUrl: './stand.component.html',
})
export class StandComponent implements OnInit, OnDestroy {
    private standService = inject(StandService);
    private matDialog = inject(MatDialog);
    private router = inject(Router);

    columns = standTableConfig;
    data$ = new BehaviorSubject<StandModel[]>([]);
    responsePagination: PaginationResponseModel<StandModel>;
    destroy$: Subject<boolean> = new Subject<boolean>();
    showAlert: boolean = false;
    alert = { type: 'success', message: '' };
    private statusmap: { [key: number]: string } = {
        0: 'Activo',
        1: 'Inactivo',
    };

    ngOnInit(): void {
        this.loadData();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    loadData(): void {
        this.standService.getAll().subscribe({
            next: (res) => {
                const transformedData = res.map(stand => ({
                    ...stand,
                    status: this.statusmap[stand.status] || 'Desconocido',
                }));

                this.responsePagination = {
                    totalRecords: transformedData.length,
                    data: transformedData,
                    pageNumber: 1,
                    pageSize: transformedData.length,
                    totalPages: 1,
                };
                this.data$.next(transformedData);
            },
            error: () => {
                console.error('Error al cargar los orígenes.');
            },
        });
    }

    createStand(): void {
        const dialogRef = this.matDialog.open(CreateStandModalComponent, {
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((newStand) => {
            if (newStand) {
                this.loadData();
            }
        });
    }

    editStand(stand: StandModel): void {
        const dialogRef = this.matDialog.open(UpdateStandModalComponent, {
            data: { stand: stand },
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((updatedStand) => {
            if (updatedStand) {
                this.loadData();
            }
        });
    }

    deleteStand(stand: StandModel): void {
        const dialogRef = this.matDialog.open(
            ConfirmDeleteStandModalComponent,
            {
                data: { id: stand.id },
                autoFocus: false,
            },
        );

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.loadData();
            }
        });
    }

    toggleStandStatus(stand: StandModel): void {
        const statusMap = { Activo: 1, Inactivo: 0 };
        const newStatus = statusMap[stand.status];

        this.standService.updateStatus(stand.id, newStatus).subscribe({
            next: () => {
                this.showTemporaryAlert(
                    'success',
                    `Estado cambiado a ${newStatus === 0 ? 'Activo' : 'Inactivo'}.`,
                );
                this.loadData();
            },
            error: (err) => {
                const errorMessage =
                    err?.message || 'Error al cambiar el estado del usuario.';
                this.showTemporaryAlert('error', errorMessage);
            },
        });
    }

    private showTemporaryAlert(type: 'success' | 'error', message: string): void {
        this.alert = { type, message };
        this.showAlert = true;
    
        setTimeout(() => {
            this.showAlert = false;
        }, 5000); 
    }
}
