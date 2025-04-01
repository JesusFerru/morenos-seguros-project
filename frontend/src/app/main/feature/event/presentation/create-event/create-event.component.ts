import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MatCheckboxChange,
    MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FuseAlertComponent } from '@fuse/components/alert';
import { OriginService } from 'app/main/feature/origin/infrastructure/services/origin.service';
import { StandService } from 'app/main/feature/stand/infrastructure/services/stand.service';
import { forkJoin } from 'rxjs';
import { EventService } from '../../infrastructure/services/event.service';

@Component({
    selector: 'create-event-modal',
    standalone: true,
    imports: [
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        NgFor,
        NgIf,
        NgClass,
        FuseAlertComponent,
        MatTableModule,
        MatIconModule
    ],
    templateUrl: './create-event.component.html',
})
export class CreateEventModalComponent implements OnInit {
    form: FormGroup;
    eventTypes = [
        { value: 0, label: 'Outlet' },
        { value: 1, label: 'CarnavalFest' },
        { value: 2, label: 'BlackWeekend' },
        { value: 3, label: 'BlackFriday' },
    ];
    alert: { type: string; message: string } | null = null;
    isSaving = false;
    availableOrigins: any[] = [];
    availableStands: any[] = [];

    selectedOrigins: any[] = [];
    eventCode: number | null = null;
    displayedColumns: string[] = ['name', 'category', 'abbreviation', 'select'];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CreateEventModalComponent>,
        private eventService: EventService,
        private originService: OriginService,
        private standService: StandService,
    ) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            type: ['', Validators.required],
            start: ['', Validators.required],
            end: ['', Validators.required],
            sendQR: [false],
            origins: [[]],
            stands: [[]],
        });
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        forkJoin({
            origins: this.originService.getAll(),
            stands: this.standService.getAll(),
        }).subscribe({
            next: (result) => {
                this.availableOrigins = result.origins;
                this.availableStands = result.stands;
            },
            error: (err) => {
                this.alert = {
                    type: 'error',
                    message:
                        'Error al cargar orígenes o stands: ' +
                        (err?.message || 'Error desconocido'),
                };
            },
        });
    }

    close(): void {
        this.dialogRef.close();
    }

    isSelected(origin: any): boolean {
        return this.selectedOrigins.some(o => o.id === origin.id);
    }

    onOriginSelectionChange(event: MatCheckboxChange, origin: any): void {
        if (event.checked) {
            this.selectedOrigins.push(origin);
        } else {
            this.selectedOrigins = this.selectedOrigins.filter(
                o => o.id !== origin.id,
            );
        }
        this.form.get('origins')?.setValue(this.selectedOrigins);
    }

    save(): void {
        if (this.form.valid) {
            this.isSaving = true;
            const formValues = this.form.value;

            const newEvent = {
                ...formValues,
                start: formValues.start
                    ? new Date(formValues.start).toISOString()
                    : null,
                end: formValues.end
                    ? new Date(formValues.end).toISOString()
                    : null,
                originIds: formValues.origins.map((origin: any) => origin.id),
                standIds: formValues.stands.map((stand: any) => stand.id),
                type: formValues.type,
            };

            this.eventService.create(newEvent).subscribe({
                next: (createdEvent) => {
                    this.alert = { type: 'success', message: 'Evento creado exitosamente.' };
                    setTimeout(() => {
                      this.dialogRef.close(createdEvent);
                    }, 1500);
                  },
                error: (err) => {
                    this.isSaving = false;
                    this.alert = {
                        type: 'error',
                        message:
                            (err?.message || 'Error al crear el evento.'),
                    };
                },
            });
        }
    }

    mapCategory(category: number): string {
        const categoryMap: { [key: number]: string } = {
            0: 'Redes Sociales',
            1: 'Corporativo',
            2: 'Volanteo',
            3: 'Influencers',
        };
        return categoryMap[category] || category.toString();
    }
}
