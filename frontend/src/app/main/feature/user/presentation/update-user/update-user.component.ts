import { Component, Inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../infrastructure/services/user.service';
import { UserRoleEnum } from 'app/shared/domain/enums/user.enum';
import { getRoleOptions } from 'app/shared/infrastructure/helpers/user.utils';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';

@Component({
    selector: 'update-user-modal',
    templateUrl: './update-user.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        NgClass,
        NgIf,
        NgFor,
        FuseAlertComponent,
    ],
})
export class UpdateUserModalComponent {
    form: FormGroup;
    roles = getRoleOptions();
    alert: { type: 'success' | 'error'; message: string } | null = null;
    isSaving = false;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<UpdateUserModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user: any },
        private userService: UserService,
    ) {
        this.form = this.fb.group({
            password: [data.user.password ?? ''],
            role: [data.user.role],
        });
    }

    save(): void {
        if (!this.form.valid) return;

        this.isSaving = true;
        const updatedUser = {
            dni: this.data.user.dni,
            password: this.form.get('password')?.value,
            role: this.form.get('role')?.value,
            firstName: this.data.user.firstName,
            lastName: this.data.user.lastName,
            isActive: this.data.user.isActive,
        };

        this.userService.update(this.data.user.dni, updatedUser).subscribe({
            next: () => this.dialogRef.close(updatedUser),
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error al actualizar el usuario.',
                };
                this.isSaving = false;
            },
        });
    }

    close(): void {
        this.dialogRef.close();
    }
}
