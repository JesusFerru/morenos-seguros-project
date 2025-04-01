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

import { UserService } from '../../infrastructure/services/user.service';

@Component({
    selector: 'create-user-modal',
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
    templateUrl: './create-user.component.html',
})
export class CreateUserModalComponent {
    form: FormGroup;
    roles = [
        { value: 'Administrador', label: 'Administrador' },
        { value: 'Collaborator', label: 'Colaborador' }
    ];
    isActive = [
        { value: 0, label: 'Activo' },
        { value: 1, label: 'Inactivo' },
    ];

    alert: { type: 'success' | 'error'; message: string } | null = null;
    isSaving = false;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CreateUserModalComponent>,
        private userService: UserService,
    ) {
        this.form = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            dni: ['', Validators.required],
            username: ['', Validators.required],
            role: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    close(): void {
        this.dialogRef.close();
    }

    save(): void {
        if (this.form.valid) {
            this.isSaving = true;
            const newUser = { ...this.form.value };

            this.userService.create(newUser).subscribe({
                next: (createdUser) => {
                    this.alert = {
                        type: 'success',
                        message: 'Usuario creado exitosamente.',
                    };
                    setTimeout(() => {
                        this.dialogRef.close(createdUser);
                    }, 1500);
                },
                error: (err) => {
                    this.alert = {
                        type: 'error',
                        message: err?.message || 'Error al crear el usuario.',
                    };
                    this.isSaving = false;
                },
            });
        }
    }
}
