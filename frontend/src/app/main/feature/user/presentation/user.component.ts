import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertComponent } from '@fuse/components/alert';
import { TableComponent } from 'app/shared/presentation/form-components/table/table.component';
import { ViewHeaderComponent } from 'app/shared/presentation/form-components/view-header/view-header.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { PaginationResponseModel } from 'app/shared/domain/models/PaginationResponseModel';
import { UserModel } from '../infrastructure/models/UserModel';
import { UserService } from '../infrastructure/services/user.service';
import { CreateUserModalComponent } from './create-user/create-user.component';
import { UpdateUserModalComponent } from './update-user/update-user.component';
import { userTableConfig } from './user.config';
import { ChangePaginationModel } from 'app/shared/domain/models/ChangePaginationModel';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ExcelExportService } from 'app/shared/infrastructure/services/excel-export.service';

@Component({
    selector: 'ms-users',
    standalone: true,
    templateUrl: './user.component.html',
    imports: [
        CommonModule,
        ViewHeaderComponent,
        TableComponent,
        FuseAlertComponent,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatButtonModule
    ],
})
export class UserComponent implements OnInit, OnDestroy {
    private userService = inject(UserService);
    private matDialog = inject(MatDialog);
    private excelExportService = inject(ExcelExportService);
    private destroy$ = new Subject<boolean>();

    public columns = userTableConfig;
    public data$ = new BehaviorSubject<UserModel[]>([]);
    public showAlert = false;
    public alert = { type: 'success', message: '' };
    public responsePagination: PaginationResponseModel<UserModel>;

    ngOnInit(): void {
        this.loadData();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private loadData(): void {
        this.userService.getAll().subscribe({
            next: (users: UserModel[]) => {
                const mapped = users.map(u => ({
                    ...u,
                }));

                this.responsePagination = {
                    totalRecords: mapped.length,
                    data: users,
                    pageNumber: 1,
                    pageSize: mapped.length,
                    totalPages: 1,
                };

                this.data$.next(mapped);
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

    public createUser(): void {
        const dialogRef = this.matDialog.open(CreateUserModalComponent, {
            width: '90vw',
            maxWidth: '500px',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.loadData();
        });
    }

    public editUser(user: UserModel): void {
        const dialogRef = this.matDialog.open(UpdateUserModalComponent, {
            data: { user },
            width: '90vw',
            maxWidth: '500px',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.loadData();
        });
    }

    public onPageChanged(event: ChangePaginationModel): void {
        const data = this.responsePagination?.data ?? [];
        const start = event.pageIndex * event.pageSize;
        const end = start + event.pageSize;
        this.data$.next(data.slice(start, end));
    }

    public toggleStatus(user: UserModel): void {
        const updated = {
            dni: user.dni,
            role: user.role,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: !user.isActive,
        };

        this.userService.update(user.dni, updated).subscribe({
            next: () => this.loadData(),
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error al actualizar estado.',
                };
                this.showAlert = true;
            },
        });
    }

    public exportToExcel(): void {
        try {
            const data = this.responsePagination?.data ?? [];
            if (data.length === 0) {
                this.alert = {
                    type: 'error',
                    message: 'No hay datos para exportar.',
                };
                this.showAlert = true;
                return;
            }

            const columnMapping = {
                dni: 'DNI',
                username: 'Usuario',
                firstName: 'Nombre',
                lastName: 'Apellido',
                role: 'Rol',
                isActive: 'Activo',
                createdAt: 'Fecha Creación',
                updatedAt: 'Última Actualización'
            };

            this.excelExportService.exportToExcelWithMapping(
                data,
                'usuarios',
                columnMapping,
                'Usuarios'
            );

            this.alert = {
                type: 'success',
                message: 'Archivo Excel exportado exitosamente.',
            };
            this.showAlert = true;

        } catch (error) {
            this.alert = {
                type: 'error',
                message: 'Error al exportar el archivo Excel.',
            };
            this.showAlert = true;
        }
    }

}
