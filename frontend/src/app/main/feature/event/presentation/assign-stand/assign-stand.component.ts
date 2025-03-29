import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FuseAlertComponent } from '@fuse/components/alert';
import { StandService } from 'app/main/feature/stand/infrastructure/services/stand.service';
import { UpdateEventStandsDto } from '../../infrastructure/dtos/UpdateEventStandsDto';
import { EventModel } from '../../infrastructure/models/EventModel';
import { EventService } from '../../infrastructure/services/event.service';

@Component({
    selector: 'app-assign-stand',
    standalone: true,
    imports: [
        NgClass,
        NgFor,
        NgIf,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatTableModule,
        MatIconModule,
        FuseAlertComponent,
    ],
    templateUrl: './assign-stand.component.html',
})
export class AssignStandComponent implements OnInit {
    form!: FormGroup;
    alert: { type: string; message: string } | null = null;
    isSaving = false;
    availableStands: any[] = [];
    standDisplayedColumns: string[] = ['name', 'select', 'queueCode'];
    event: EventModel;

    eventTypes = [
        { value: 'Outlet', label: 'Outlet' },
        { value: 'CarnavalFest', label: 'CarnavalFest' },
        { value: 'BlackWeekend', label: 'BlackWeekend' },
        { value: 'BlackFriday', label: 'BlackFriday' },
    ];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AssignStandComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { event: EventModel },
        private eventService: EventService,
        private standService: StandService,
    ) {
        this.event = data.event;
    }

    ngOnInit(): void {
        this.initializeForm();
        this.loadStands();
    }

    private initializeForm(): void {
        this.form = this.fb.group({
            name: [
                { value: this.event.name, disabled: true },
                Validators.required,
            ],
            type: [
                { value: this.event.type, disabled: true },
                Validators.required,
            ],
            start: [
                { value: this.getSafeDate(this.event.start), disabled: true },
                Validators.required,
            ],
            end: [
                { value: this.getSafeDate(this.event.end), disabled: true },
                Validators.required,
            ],
            sendQR: [{ value: this.event.sendQR, disabled: true }],
            stands: [this.event.standAssignments || this.event.stands || []],
        });
    }

    private getSafeDate(dateStr: string): Date {
        try {
            return dateStr ? new Date(dateStr) : new Date();
        } catch {
            return new Date();
        }
    }

    loadStands(): void {
        this.standService.getAll().subscribe({
            next: (stands: any[]) => {
                this.availableStands = stands.map((stand: any) => {
                    const assigned = (
                        this.event.standAssignments ||
                        this.event.stands ||
                        []
                    ).find((s: any) => {
                        if (typeof s === 'string') {
                            return s === stand.id;
                        } else {
                            return s.id === stand.id || s.standId === stand.id;
                        }
                    });
                    return {
                        ...stand,
                        queueCode:
                            assigned && typeof assigned === 'object'
                                ? assigned.queueCode
                                : '',
                    };
                });
            },
            error: (error: any) => {
                console.error('Error al cargar stands', error);
            },
        });
    }

    isStandSelected(stand: any): boolean {
        const selectedStands: any[] = this.form.get('stands')?.value || [];
        return selectedStands.some(s => s.id === stand.id);
    }

    onStandSelectionChange(event: MatCheckboxChange, stand: any): void {
        let selectedStands: any[] = this.form.get('stands')?.value || [];
        if (event.checked) {
            if (!this.isStandSelected(stand)) {
                selectedStands.push(stand);
            }
        } else {
            selectedStands = selectedStands.filter(
                (s: any) => s.id !== stand.id,
            );
        }
        this.form.get('stands')?.setValue(selectedStands);
    }

    save(): void {
        if (this.form.valid) {
            this.isSaving = true;
            const selectedStands = this.availableStands.filter(stand =>
                this.isStandSelected(stand),
            );
            const standAssignments = selectedStands.map(stand => ({
                standId: stand.id,
                queueCode: stand.queueCode,
            }));
            const updateDto: UpdateEventStandsDto = {
                StandAssignments: standAssignments,
            };
            console.log('updateDto', updateDto);

            this.eventService.updateStands(this.event.id, updateDto).subscribe({
                next: () => {
                    this.alert = {
                        type: 'success',
                        message: 'Stands asignados al evento exitosamente.',
                    };
                    setTimeout(() => {
                        this.dialogRef.close(updateDto);
                    }, 1500);
                },
                error: (err: any) => {
                    this.isSaving = false;
                    this.alert = {
                        type: 'error',
                        message:
                            err?.message ||
                            'Error al realizar la asignación de stands al evento.',
                    };
                },
            });
        }
    }

    close(): void {
        this.dialogRef.close();
    }

    areQueueCodesValid(): boolean {
        const selectedStands = this.availableStands.filter(stand =>
            this.isStandSelected(stand),
        );
        return selectedStands.every(
            stand => stand.queueCode && stand.queueCode.trim() !== '',
        );
    }
}
