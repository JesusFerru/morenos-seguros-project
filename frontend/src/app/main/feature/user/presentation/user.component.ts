import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { PaginationResponseModel } from 'app/shared/domain/models/PaginationResponseModel';
import { TableComponent } from 'app/shared/presentation/form-components/table/table.component';
import { ViewHeaderComponent } from 'app/shared/presentation/form-components/view-header/view-header.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserModel } from '../infrastructure/models/UserModel';
import { UserService } from '../infrastructure/services/user.service';
import { CreateUserModalComponent } from './create-user/create-user.component';
import { ConfirmDeleteUserModalComponent } from './delete-user/delete-user.component';
import { UpdateUserModalComponent } from './update-user/update-user.component';
import { userTableConfig } from './user.config';

@Component({
    selector: 'tt-users',
    standalone: true,
    imports: [
        ViewHeaderComponent,
        CommonModule,
        TableComponent,
        FuseAlertComponent,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
    ],
    templateUrl: './user.component.html',
})
export class UserComponent implements OnInit, OnDestroy {
    _router = inject(Router);

    private userService = inject(UserService);
    private matDialog = inject(MatDialog);

    columns = userTableConfig;
    data$ = new BehaviorSubject<UserModel[]>([]);
    showAlert: boolean = false;
    alert = { type: 'success', message: '' };
    isDownloading: boolean = false;
    responsePagination: PaginationResponseModel<UserModel>;
    destroy$: Subject<boolean> = new Subject<boolean>();

    private statusMap: { [key: number]: string } = {
        0: 'Activo',
        1: 'Inactivo',
    };

    private rolemap: { [key: number]: string } = {
        0: 'SuperAdmin',
        1: 'Administrador',
        2: 'Personal de Ingreso',
        3: 'Concierge',
    };

    ngOnInit(): void {
        this.loadData();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    loadData(): void {
        this.userService.getAll().subscribe({
            next: (res) => {
                const transformedData = res.map(user => ({
                    ...user,
                    status: this.statusMap[user.status] || 'Desconocido',
                    role: this.rolemap[user.role] || 'Desconocido',
                }));

                this.responsePagination = {
                    totalRecords: transformedData.length,
                    data: transformedData,
                    pageNumber: 1,
                    pageSize: transformedData.length,
                    totalPages: 1,
                };
                this.data$.next(transformedData);
            },
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error al cargar los usuarios.',
                };
                this.showAlert = true;
            },
        });
    }

    downloadUsersExcel(): void {
        this.isDownloading = true;
    
        this.userService.downloadUsersExcel().subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = 'Usuarios.xlsx';
    
                document.body.appendChild(anchor);
                anchor.click();
                window.URL.revokeObjectURL(url);
                anchor.remove();
    
                this.isDownloading = false;
            },
            error: (error) => {
                console.error('Error al descargar el archivo:', error);
                this.isDownloading = false;
            },
        });
    }
    
    createUser(): void {
        const dialogRef = this.matDialog.open(CreateUserModalComponent, {
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadData();
            }
        });
    }

    editUser(user: UserModel): void {
        const dialogRef = this.matDialog.open(UpdateUserModalComponent, {
            data: { user },
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((updatedUser) => {
            if (updatedUser) {
                this.loadData();
            }
        });
    }

    deleteUser(user: UserModel): void {
        const dialogRef = this.matDialog.open(ConfirmDeleteUserModalComponent, {
            data: { id: user.id },
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.loadData();
            }
        });
    }
    
    toggleUserStatus(user: UserModel): void {
        const statusMap = { Activo: 1, Inactivo: 0 };
        const newStatus = statusMap[user.status];
    
        this.userService.updateStatus(user.id, newStatus).subscribe({
            next: () => {
                this.showTemporaryAlert('success', `Estado cambiado a ${newStatus === 0 ? 'Activo' : 'Inactivo'}.`);
                this.loadData();
            },
            error: (err) => {
                const errorMessage = err?.message || 'Error al cambiar el estado del usuario.';
                this.showTemporaryAlert('error', errorMessage);
            },
        });
    }

    mapRole(role: string): number {
        const roles = { 'Administrador': 1, 'Personal de Ingreso': 2, 'Concierge': 3 };
        return roles[role] || 0;
    }
    

    mapStatus(status: string): number {
        const statusMap = { Activo: 0, Inactivo: 1 };
        return statusMap[status] ?? 0;
    }

    private showTemporaryAlert(type: 'success' | 'error', message: string): void {
        this.alert = { type, message };
        this.showAlert = true;
    
        setTimeout(() => {
            this.showAlert = false;
        }, 5000); 
    }
}
