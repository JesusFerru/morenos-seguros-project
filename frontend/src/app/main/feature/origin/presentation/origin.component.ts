import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { PaginationResponseModel } from 'app/shared/domain/models/PaginationResponseModel';
import { TableComponent } from 'app/shared/presentation/form-components/table/table.component';
import { ViewHeaderComponent } from 'app/shared/presentation/form-components/view-header/view-header.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { OriginModel } from '../infrastructure/models/OriginModel';
import { OriginService } from '../infrastructure/services/origin.service';
import { CreateOriginModalComponent } from './create-origin/create-origin.component';
import { ConfirmDeleteOriginModalComponent } from './delete-origin/delete-origin.component';
import { originTableConfig } from './origin.config';
import { UpdateOriginModalComponent } from './update-origin/update-origin.component';

@Component({
    selector: 'tt-origins',
    standalone: true,
    imports: [
        ViewHeaderComponent,
        CommonModule,
        TableComponent,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
    ],
    templateUrl: './origin.component.html',
})
export class OriginComponent implements OnInit, OnDestroy {
    private originService = inject(OriginService);
    private matDialog = inject(MatDialog);
    private router = inject(Router);

    columns = originTableConfig;
    data$ = new BehaviorSubject<OriginModel[]>([]);
    responsePagination: PaginationResponseModel<OriginModel>;
    destroy$: Subject<boolean> = new Subject<boolean>();
    private categorymap: { [key: number]: string } = {
        0: 'Redes Sociales',
        1: 'Corporativo',
        2: 'Volanteo',
        3: 'Influencers',
    };

    ngOnInit(): void {
        this.loadData();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    loadData(): void {
        this.originService.getAll().subscribe({
            next: (res) => {
                const transformedData = res.map(origin => ({
                    ...origin,
                    category: this.categorymap[origin.category] || 'Desconocido',
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

    createOrigin(): void {
        const dialogRef = this.matDialog.open(CreateOriginModalComponent, {
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((newOrigin) => {
            if (newOrigin) {
                this.loadData();
            }
        });
    }

    editOrigin(origin: OriginModel): void {
        const dialogRef = this.matDialog.open(UpdateOriginModalComponent, {
            data: { origin: origin },
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((updatedOrigin) => {
            if (updatedOrigin) {
                this.loadData();
            }
        });
    }

    deleteOrigin(origin: OriginModel): void {
        const dialogRef = this.matDialog.open(ConfirmDeleteOriginModalComponent, {
            data: { id: origin.id },
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.loadData();
            }
        });
    }
}
