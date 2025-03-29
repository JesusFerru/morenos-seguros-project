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
import { EventModel } from '../infrastructure/models/EventModel';
import { EventService } from '../infrastructure/services/event.service';
import { AssignStandComponent } from './assign-stand/assign-stand.component';
import { CreateEventModalComponent } from './create-event/create-event.component';
import { ConfirmDeleteEventModalComponent } from './delete-event/delete-event.component';
import { eventTableConfig } from './event.config';
import { UpdateEventModalComponent } from './update-event/update-event.component';

@Component({
    selector: 'tt-events',
    standalone: true,
    imports: [
        ViewHeaderComponent,
        CommonModule,
        TableComponent,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
    ],
    templateUrl: './event.component.html',
})
export class EventComponent implements OnInit, OnDestroy {
    private eventService = inject(EventService);
    private matDialog = inject(MatDialog);
    private router = inject(Router);

    columns = eventTableConfig;
    data$ = new BehaviorSubject<EventModel[]>([]);
    responsePagination: PaginationResponseModel<EventModel>;
    destroy$: Subject<boolean> = new Subject<boolean>();
    private typemap: { [key: number]: string } = {
        0: 'Outlet',
        1: 'CarnavalFest',
        2: 'BlackWeekend',
        3: 'BlackFriday',
    };

    ngOnInit(): void {
        this.loadData();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    loadData(): void {
        this.eventService.getAll().subscribe({
            next: (res) => {
                const transformedData = res.map(event => ({
                    ...event,
                    type: this.typemap[event.type] || 'Desconocido',
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

    createEvent(): void {
        const dialogRef = this.matDialog.open(CreateEventModalComponent, {
            width: '90vw',
            maxWidth: '1200px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((newEvent) => {
            if (newEvent) {
                this.loadData();
            }
        });
    }

    editEvent(event: EventModel): void {
        const dialogRef = this.matDialog.open(UpdateEventModalComponent, {
            data: { event: event },
            width: '90vw',
            maxWidth: '1200px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((updatedEvent) => {
            if (updatedEvent) {
                this.loadData();
            }
        });
    }

    assignStandsToEvent(event: EventModel): void {
        const dialogRef = this.matDialog.open(AssignStandComponent, {
            data: { event: event },
            width: '90vw',
            maxWidth: '1200px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((updatedEvent) => {
            if (updatedEvent) {
                this.loadData();
            }
        });
    }

    deleteEvent(event: EventModel): void {
        const dialogRef = this.matDialog.open(
            ConfirmDeleteEventModalComponent,
            {
                data: { id: event.id },
                autoFocus: false,
            },
        );

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.loadData();
            }
        });
    }
}
