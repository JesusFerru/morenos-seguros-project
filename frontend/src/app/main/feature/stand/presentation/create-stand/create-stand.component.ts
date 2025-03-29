import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertComponent } from '@fuse/components/alert';
import { StandService } from '../../infrastructure/services/stand.service';

@Component({
    selector: 'create-stand-modal',
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
    templateUrl: './create-stand.component.html',
})
export class CreateStandModalComponent {
    form: FormGroup;
    statuses = [
        { value: 0, label: 'Activo' },
        { value: 1, label: 'Inactivo' },
    ];
    alert: { type: string; message: string } | null = null;
    isSaving = false;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CreateStandModalComponent>,
        private standService: StandService,
    ) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            status: ['', Validators.required],
        });
    }

    close(): void {
        this.dialogRef.close();
    }

    save(): void {
        if (this.form.valid) {
            this.isSaving = true;
            const newStand = {
                ...this.form.value,
            };
            this.standService.create(newStand).subscribe({
                next: (createdStand) => {
                    this.alert = {
                        type: 'success',
                        message: 'Stand creado exitosamente.',
                    };
                    setTimeout(() => {
                        this.dialogRef.close(createdStand);
                    }, 1500);
                },
                error: (err) => {
                    this.alert = {
                        type: 'error',
                        message: err?.message || 'Error al crear el stand.',
                    };
                    this.isSaving = false;
                },
            });
        }
    }
}
