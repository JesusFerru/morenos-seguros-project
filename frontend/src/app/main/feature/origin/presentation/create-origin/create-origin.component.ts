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
import { OriginService } from '../../infrastructure/services/origin.service';

@Component({
    selector: 'create-origin-modal',
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
    templateUrl: './create-origin.component.html',
})
export class CreateOriginModalComponent {
    form: FormGroup;
    categories = [
        { value: 0, label: 'Redes Sociales' },
        { value: 1, label: 'Corporativo' },
        { value: 2, label: 'Volanteo' },
        { value: 3, label: 'Influencers' },
    ];
    alert: { type: string; message: string } | null = null;
    isSaving = false;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CreateOriginModalComponent>,
        private originService: OriginService,
    ) {
        this.form = this.fb.group({
            abbreviation: ['', Validators.required],
            name: ['', Validators.required],
            category: ['', Validators.required],
        });
    }

    close(): void {
        this.dialogRef.close();
    }

    save(): void {
        if (this.form.valid) {
            this.isSaving = true;
            const newOrigin = {
                ...this.form.value,
            };
            this.originService.create(newOrigin).subscribe({
                next: (createdOrigin) => {
                    this.alert = {
                        type: 'success',
                        message: 'Origen creado exitosamente.',
                    };
                    setTimeout(() => {
                        this.dialogRef.close(createdOrigin);
                    }, 1500);
                },
                error: (err) => {
                    this.alert = {
                        type: 'error',
                        message: err?.message || 'Error al crear el origen.',
                    };
                    this.isSaving = false;
                },
            });
        }
    }
}
