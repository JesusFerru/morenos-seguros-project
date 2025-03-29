import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    selector: 'update-event-modal',
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
        MatIconModule,
    ],
    templateUrl: './update-event.component.html',
})
export class UpdateEventModalComponent implements OnInit {
    form!: FormGroup;
    eventTypes = [
        { value: 'Outlet', label: 'Outlet' },
        { value: 'CarnavalFest', label: 'CarnavalFest' },
        { value: 'BlackWeekend', label: 'BlackWeekend' },
        { value: 'BlackFriday', label: 'BlackFriday' },
    ];
    alert: { type: string; message: string } | null = null;
    isSaving = false;
    availableOrigins: any[] = [];
    availableStands: any[] = [];
    selectedOrigins: any[] = [];
    eventCode: number | null = null;
    displayedColumns: string[] = [
        'name',
        'category',
        'abbreviation',
        'select',
        'url',
    ];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<UpdateEventModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { event: any },
        private eventService: EventService,
        private originService: OriginService,
        private standService: StandService,
    ) {}

    async ngOnInit(): Promise<void> {
        try {
            await this.loadData();
        } catch (err) {
            this.alert = { type: 'error', message: 'Error al cargar datos.' };
        } finally {
            this.initializeForm();
        }
    }

    private async loadData(): Promise<void> {
        return new Promise((resolve, reject) => {
            forkJoin({
                origins: this.originService.getAll(),
                stands: this.standService.getAll(),
            }).subscribe({
                next: (result) => {
                    this.availableOrigins = result.origins || [];
                    this.availableStands = result.stands || [];
                    this.eventCode = this.data.event?.code || null;
                    this.selectedOrigins = this.getSelectedObjects(
                        this.data.event?.origins || [],
                        'origins',
                    );
                    resolve();
                },
                error: err => reject(err),
            });
        });
    }

    private initializeForm(): void {
        const safeStart = this.getSafeDate(this.data.event?.start);
        const safeEnd = this.getSafeDate(this.data.event?.end);

        this.form = this.fb.group({
            name: [this.data.event?.name || '', Validators.required],
            type: [this.data.event?.type || '', Validators.required],
            start: [safeStart, Validators.required],
            end: [safeEnd, Validators.required],
            sendQR: [this.data.event?.sendQR || false],
            origins: [this.selectedOrigins],
            stands: [
                this.getSelectedObjects(
                    this.data.event?.stands || [],
                    'stands',
                ),
            ],
        });
    }

    private getSafeDate(dateStr: string): Date {
        try {
            return dateStr ? new Date(dateStr) : new Date();
        } catch {
            return new Date();
        }
    }

    private getSelectedObjects(
        items: any[],
        type: 'origins' | 'stands',
    ): any[] {
        const source =
            type === 'origins' ? this.availableOrigins : this.availableStands;
        if (!source || source.length === 0) return [];

        return items
            .map(item => source.find(obj => obj.id === item.id))
            .filter(item => item !== undefined);
    }

    public compareOrigins(o1: any, o2: any): boolean {
        return o1?.id === o2?.id;
    }

    public compareStands(s1: any, s2: any): boolean {
        return s1?.id === s2?.id;
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

    exportSelectedOrigins(): void {
        const exportData = {
            EventCode: this.data.event.code,
            Origins: this.selectedOrigins.map(origin => ({
                Name: origin.name,
                Category: this.mapCategory(origin.category),
                Abbreviation: origin.abbreviation,
            })),
        };

        this.eventService.exportOriginsExcel(exportData).subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = 'Origenes.xlsx';
                document.body.appendChild(anchor);
                anchor.click();
                window.URL.revokeObjectURL(url);
                anchor.remove();
            },
            error: (error) => {
                console.error('Error al exportar orígenes:', error);
            },
        });
    }

    close(): void {
        this.dialogRef.close();
    }

    save(): void {
        if (this.form?.valid) {
            this.isSaving = true;
            const formValues = this.form.value;

            const startDate = new Date(formValues.start);
            const endDate = new Date(formValues.end);
            const updatedEvent = {
                ...this.data.event,
                ...formValues,
                type: this.mapType(formValues.type),
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                originIds:
                    formValues.origins?.map((origin: any) => origin.id) || [],
                standIds:
                    formValues.stands?.map((stand: any) => stand.id) || [],
            };

            this.eventService
                .update(this.data.event.id, updatedEvent)
                .subscribe({
                    next: () => {
                        this.alert = { type: 'success', message: 'Evento actualizado exitosamente.' };
                        setTimeout(() => {
                          this.dialogRef.close(updatedEvent);
                        }, 1500);
                      },
                    error: (err) => {
                        this.isSaving = false;
                        this.alert = {
                            type: 'error',
                            message:
                                (err?.message || 'Error al actualizar el evento.'),
                        };
                    },
                });
        }
    }

    mapType(type: string): number {
        const typeMap = {
            Outlet: 0,
            CarnavalFest: 1,
            BlackWeekend: 2,
            BlackFriday: 3,
        };
        return typeMap[type] ?? 0;
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
