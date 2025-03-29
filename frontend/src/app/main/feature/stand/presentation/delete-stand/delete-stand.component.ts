import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertComponent } from '@fuse/components/alert';
import { StandService } from '../../infrastructure/services/stand.service';

@Component({
    selector: 'delete-stand-modal',
    standalone: true,
    imports: [
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        FuseAlertComponent,
        NgIf,
    ],
    templateUrl: './delete-stand.component.html',
})
export class ConfirmDeleteStandModalComponent {
    alert: { type: string; message: string } | null = null;
    isDeleting = false;

    constructor(
        private dialogRef: MatDialogRef<ConfirmDeleteStandModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { id: string },
        private standService: StandService,
    ) {}

    onConfirm(): void {
        this.isDeleting = true;
        this.standService.deleteStand(this.data.id).subscribe({
            next: () => {
                this.alert = {
                    type: 'success',
                    message: 'Stand eliminado exitosamente.',
                };
                setTimeout(() => {
                    this.dialogRef.close(true);
                }, 1500);
            },
            error: (err) => {
                this.alert = {
                    type: 'error',
                    message: err?.message || 'Error al eliminar el stand.',
                };
                this.isDeleting = false;
            },
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
