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
import { UpdateUserModalComponent } from './update-user/update-user.component';
import { userTableConfig } from './user.config';
import { ChangePaginationModel } from 'app/shared/domain/models/ChangePaginationModel';
import { UserRoleEnum, UserStatusEnum } from 'app/shared/domain/enums/user.enum';

enum UserStatus {
    Inactive = 0,
    Active = 1,
}

interface Alert {
    type: 'success' | 'error';
    message: string;
}

@Component({
    selector: 'ms-users',
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
    private userService = inject(UserService);
    private matDialog = inject(MatDialog);

    public columns = userTableConfig;
    public data$ = new BehaviorSubject<UserModel[]>([]);
    public showAlert = false;
    public alert: Alert = { type: 'success', message: '' };
    public isDownloading = false;
    public responsePagination: PaginationResponseModel<UserModel>;
    private destroy$ = new Subject<boolean>();

    ngOnInit(): void {
        this.loadData();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private loadData(): void {
        this.userService.getAll().subscribe({
            next: (res: UserModel[]) => {
                const sortedData = res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                const transformedData = sortedData.map(user => ({
                    ...user,
                    role: UserRoleEnum[user.role as keyof typeof UserRoleEnum] ?? user.role,
                    status: user.isActive ? UserStatusEnum.Active : UserStatusEnum.Inactive
                }));

                this.responsePagination = {
                    totalRecords: transformedData.length,
                    data: transformedData as unknown as UserModel[],
                    pageNumber: 1,
                    pageSize: transformedData.length,
                    totalPages: 1,
                };

                this.data$.next(transformedData as unknown as UserModel[]);
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
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadData();
            }
        });
    }

    public onPageChanged(event: ChangePaginationModel): void {
        const data = this.responsePagination?.data ?? [];
        const start = event.pageIndex * event.pageSize;
        const end = start + event.pageSize;
        const paginated = data.slice(start, end);

        this.data$.next(paginated);
    }


    public editUser(user: UserModel): void {
        const dialogRef = this.matDialog.open(UpdateUserModalComponent, {
            data: { user },
            width: '90vw',
            maxWidth: '500px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe(updatedUser => {
            if (updatedUser) {
                this.loadData();
            }
        });
    }
}
