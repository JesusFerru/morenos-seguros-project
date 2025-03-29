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
import { OriginService } from '../../infrastructure/services/origin.service';

@Component({
    selector: 'update-origin-modal',
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
    templateUrl: './update-origin.component.html',
})
export class UpdateOriginModalComponent {
    form: FormGroup;
    categories = [
        { value: 'Redes Sociales', label: 'Redes Sociales' },
        { value: 'Corporativo', label: 'Corporativo' },
        { value: 'Volanteo', label: 'Volanteo' },
        { value: 'Influencers', label: 'Influencers' },
    ];
    alert: { type: string; message: string } | null = null;
    isSaving = false;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<UpdateOriginModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { origin: any },
        private originService: OriginService,
    ) {
        this.form = this.fb.group({
            abbreviation: [
                { value: data.origin.abbreviation, disabled: true },
                Validators.required,
            ],
            name: [data.origin.name, Validators.required],
            category: [data.origin.category, Validators.required],
        });
    }

    close(): void {
        this.dialogRef.close();
    }

    save(): void {
        if (this.form.valid) {
            this.isSaving = true;

            const updatedOrigin = {
                ...this.data.origin,
                ...this.form.value,
                category: this.mapCategory(this.form.value.category),
            };

            this.originService
                .update(this.data.origin.id, updatedOrigin)
                .subscribe({
                    next: () => {
                        this.alert = {
                            type: 'success',
                            message: 'Origen actualizado exitosamente.',
                        };
                        setTimeout(() => {
                            this.dialogRef.close(updatedOrigin);
                        }, 1500);
                    },
                    error: (err) => {
                        this.alert = {
                            type: 'error',
                            message:
                                err?.message ||
                                'Error al actualizar el origen.',
                        };
                        this.isSaving = false;
                    },
                });
        }
    }

    mapCategory(category: string): number {
        const categoryMap = {
            'Redes Sociales': 0,
            'Corporativo': 1,
            'Volanteo': 2,
            'Influencers': 3,
        };
        return categoryMap[category] ?? 0;
    }
}
