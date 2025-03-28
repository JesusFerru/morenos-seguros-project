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

import { UserService } from '../../infrastructure/services/user.service';

@Component({
    selector: 'update-user-modal',
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
    templateUrl: './update-user.component.html',
})
export class UpdateUserModalComponent {
    form: FormGroup;

    roles = [
        { value: 'Administrador', label: 'Administrador' },
        { value: 'Personal de Ingreso', label: 'Personal de Ingreso' },
        { value: 'Concierge', label: 'Concierge' },
    ];

    status = [
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
    ];

    alert: { type: 'success' | 'error'; message: string } | null = null;
    isSaving = false;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<UpdateUserModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user: any },
        private userService: UserService,
    ) {
        this.form = this.fb.group({
            username: [
                { value: data.user.username, disabled: true },
                Validators.required,
            ],
            fullName: [data.user.fullName, Validators.required],
            role: [data.user.role, Validators.required],
            status: [data.user.status, Validators.required],
            password: [data.user.password, Validators.required],
        });
    }

    close(): void {
        this.dialogRef.close();
    }

    save(): void {
        if (this.form.valid) {
            this.isSaving = true;

            const updatedUser = {
                ...this.data.user,
                ...this.form.value,
                role: this.mapRoles(this.form.value.role),
                status: this.mapStatus(this.form.value.status),
            };

            this.userService.update(this.data.user.id, updatedUser).subscribe({
                next: () => {
                    this.alert = {
                        type: 'success',
                        message: 'Usuario actualizado correctamente.',
                    };
                    setTimeout(() => {
                        this.dialogRef.close(updatedUser);
                    }, 1500);
                },
                error: (err) => {
                    this.alert = {
                        type: 'error',
                        message:
                            err?.message || 'Error al actualizar el usuario.',
                    };
                    this.isSaving = false;
                },
            });
        }
    }

    mapRoles(role: string): number {
        const roleMap = {
            'Administrador': 1,
            'Personal de Ingreso': 2,
            'Concierge': 3,
        };
        return roleMap[role] ?? 0;
    }
    mapStatus(status: string): number {
        const statusMap = {
            Activo: 0,
            Inactivo: 1,
        };
        return statusMap[status] ?? 0;
    }
}
