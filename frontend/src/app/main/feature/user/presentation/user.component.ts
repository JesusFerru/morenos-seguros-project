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
import { getTranslatedRole } from 'app/shared/infrastructure/helpers/user.utils';

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
        MatSlideToggleModule
    ],
})
export class UserComponent implements OnInit, OnDestroy {
    private userService = inject(UserService);
    private matDialog = inject(MatDialog);
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
                    role: getTranslatedRole(u.role),
                }));

                this.responsePagination = {
                    totalRecords: mapped.length,
                    data: mapped,
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

    public toggleUserStatus(user: UserModel): void {
        const updated = {
            ...user,
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
}
