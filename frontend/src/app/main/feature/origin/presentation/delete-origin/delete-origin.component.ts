import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertComponent } from '@fuse/components/alert';
import { OriginService } from '../../infrastructure/services/origin.service';

@Component({
    selector: 'delete-origin-modal',
    standalone: true,
    imports: [
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        FuseAlertComponent,
        NgIf,
    ],
    templateUrl: './delete-origin.component.html',
})
export class ConfirmDeleteOriginModalComponent {
    alert: { type: string; message: string } | null = null;
    isDeleting = false;

    constructor(
        private dialogRef: MatDialogRef<ConfirmDeleteOriginModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { id: string },
        private originService: OriginService,
    ) {}

    onConfirm(): void {
        this.isDeleting = true;
        this.originService.deleteOrigin(this.data.id).subscribe({
            next: () => {
                this.alert = {
                    type: 'success',
                    message: 'Origen eliminado exitosamente.',
                };
                setTimeout(() => {
                    this.dialogRef.close(true);
                }, 1500);
            },
            error: (err) => {
                this.alert = {
                    type: 'error',
                    message: err?.message || 'Error al eliminar el origen.',
                };
                this.isDeleting = false;
            },
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
