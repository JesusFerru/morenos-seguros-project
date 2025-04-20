import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { User } from 'app/shared/infrastructure/helpers/user.types';
import { getRoleOptions } from 'app/shared/infrastructure/helpers/user.utils';
import { UserService } from 'app/shared/infrastructure/services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'ms-dashboard',
    standalone: true,
    imports: [],
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    private _userService = inject(UserService);
    private _changeDetectorRef = inject(ChangeDetectorRef);

    user: User;
    private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

    roles = getRoleOptions();

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(true);
        this._unsubscribeAll.complete();
    }

    transform(roleValue: string): string {
        const match = this.roles.find(option => option.value === roleValue);
        return match?.label ?? roleValue;
    }
}
