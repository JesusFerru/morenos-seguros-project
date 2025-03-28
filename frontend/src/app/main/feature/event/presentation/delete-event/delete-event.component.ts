import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertComponent } from '@fuse/components/alert';
import { EventService } from '../../infrastructure/services/event.service';

@Component({
    selector: 'delete-event-modal',
    standalone: true,
    imports: [
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        FuseAlertComponent,
        NgIf,
    ],
    templateUrl: './delete-event.component.html',
})
export class ConfirmDeleteEventModalComponent {
    alert: { type: string; message: string } | null = null;
    isDeleting = false;

    constructor(
        private dialogRef: MatDialogRef<ConfirmDeleteEventModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { id: string },
        private eventService: EventService,
    ) {}

    onConfirm(): void {
        this.isDeleting = true;
        this.eventService.deleteEvent(this.data.id).subscribe({
            next: () => {
                this.alert = {
                    type: 'success',
                    message: 'Evento eliminado exitosamente.',
                };
                setTimeout(() => {
                    this.dialogRef.close(true);
                }, 1500);
            },
            error: (err) => {
                this.alert = {
                    type: 'error',
                    message:
                        (err?.message || 'Error al eliminar el evento.'),
                };
                this.isDeleting = false;
            },
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
