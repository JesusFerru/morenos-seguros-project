import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertComponent } from '@fuse/components/alert';

import { UserService } from '../../infrastructure/services/user.service';

@Component({
    selector: 'confirm-delete-user-modal',
    standalone: true,
    imports: [
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        FuseAlertComponent,
        NgIf
    ],
    templateUrl: './delete-user.component.html',
})
export class ConfirmDeleteUserModalComponent {
    alert: { type: 'success' | 'error'; message: string } | null = null;
    isDeleting = false;

    constructor(
        private dialogRef: MatDialogRef<ConfirmDeleteUserModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { id: string },
        private userService: UserService
    ) {}

    onConfirm(): void {
        this.isDeleting = true;
        this.userService.deleteUser(this.data.id).subscribe({
            next: () => {
                this.alert = { type: 'success', message: 'Usuario eliminado exitosamente.' };
                setTimeout(() => {
                    this.dialogRef.close(true);
                }, 1500);
            },
            error: (err) => {
                this.alert = {
                    type: 'error',
                    message: err?.message || 'Error al eliminar el usuario.',
                };
                this.isDeleting = false;
            },
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
