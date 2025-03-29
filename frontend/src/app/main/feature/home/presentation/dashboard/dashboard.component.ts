import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { User } from 'app/shared/infrastructure/helpers/user.types';
import { UserService } from 'app/shared/infrastructure/services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'tt-dashboard',
    standalone: true,
    imports: [],
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    _userService = inject(UserService);
    _changeDetectorRef = inject(ChangeDetectorRef);

    user: User;
    private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

    private roleMap: { [key: string]: string } = {
        'Admin': 'Administrador',
        'RegAdmission': 'Personal de Ingreso',
        'Concierge': 'Concierge'
      };
    
      
    

    ngOnInit(): void {
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
 * On destroy
 */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(true);
        this._unsubscribeAll.complete();
    }

    transform(value: string): string {
        return this.roleMap[value] || value;
      }


}
