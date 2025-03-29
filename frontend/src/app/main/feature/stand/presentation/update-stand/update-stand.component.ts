import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertComponent } from '@fuse/components/alert';
import { StandService } from '../../infrastructure/services/stand.service';

@Component({
    selector: 'update-stand-modal',
    standalone: true,
    imports: [
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        ReactiveFormsModule,
        NgFor,
        NgIf,
        NgClass,
        FuseAlertComponent,
    ],
    templateUrl: './update-stand.component.html',
})
export class UpdateStandModalComponent {
    form: FormGroup;
    statuses = [
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
    ];
    alert: { type: string; message: string } | null = null;
    isSaving = false;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<UpdateStandModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { stand: any },
        private standService: StandService,
    ) {
        this.form = this.fb.group({
            name: [data.stand.name, Validators.required],
            status: [data.stand.status, Validators.required],
        });
    }

    close(): void {
        this.dialogRef.close();
    }

    save(): void {
        if (this.form.valid) {
            this.isSaving = true;

            const updatedStand = {
                ...this.data.stand,
                ...this.form.value,
                status: this.mapStatus(this.form.value.status),
            };

            this.standService
                .update(this.data.stand.id, updatedStand)
                .subscribe({
                    next: () => {
                        this.alert = {
                            type: 'success',
                            message: 'Stand actualizado exitosamente.',
                        };
                        setTimeout(() => {
                            this.dialogRef.close(updatedStand);
                        }, 1500);
                    },
                    error: (err) => {
                        this.alert = {
                            type: 'error',
                            message:
                                err?.message || 'Error al actualizar el stand.',
                        };
                        this.isSaving = false;
                    },
                });
        }
    }

    mapStatus(status: string): number {
        const statusMap = { Activo: 0, Inactivo: 1 };
        return statusMap[status] ?? 0;
    }
}
