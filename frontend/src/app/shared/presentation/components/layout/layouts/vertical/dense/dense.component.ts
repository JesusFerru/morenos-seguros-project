import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import {
    FuseNavigationItem,
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { User } from 'app/shared/infrastructure/helpers/user.types';
import { NavigationService } from 'app/shared/infrastructure/services/navigation/navigation.service';
import { Navigation } from 'app/shared/infrastructure/services/navigation/navigation.types';
import { UserService } from 'app/shared/infrastructure/services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'dense-layout',
    templateUrl: './dense.component.html',
    styleUrl: './dense.component.scss',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        FuseLoadingBarComponent,
        FuseVerticalNavigationComponent,
        MatButtonModule,
        MatIconModule,
        NgIf,
        RouterOutlet
    ],
})
export class DenseLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: FuseNavigationItem[];
    navigationAppearance: 'default' | 'dense' = 'dense';
    imgOpen = false;
    user: User;
    private _unsubscribeAll: Subject<boolean> = new Subject<boolean>();

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef
    ) { }
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');

                // Change the navigation appearance
                this.navigationAppearance = this.isScreenSmall
                    ? 'default'
                    : 'dense';
            });

        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
                const navigation = this._navigationService.get();
                this.hasPermissionTransaction(navigation,this.user.rolUser!,this.user.userName!)
                this._changeDetectorRef.markForCheck();
            });
    }

    hasPermissionTransaction(navigation: Navigation, role: string, user: string): void {
        this.navigation = navigation.default
            .map(navItem => this.filterNavigationItem(navItem, role, user))
            .filter(navItem => navItem !== null) as FuseNavigationItem[];
    }

    private filterNavigationItem(item: FuseNavigationItem, role: string, user: string): FuseNavigationItem | null {
        const navRoles = item.role?.split(',').map(r => r.trim()) || [];
        const hasRolePermission = navRoles.includes(role) || navRoles.includes('All');

        const userLower = user ? user.toLowerCase() : '';
        const hasUserPermission = !item.meta || item.meta.some(meta => meta.toLowerCase() === userLower);

        if (item.children && item.children.length > 0) {
            const filteredChildren = item.children
                .map(child => this.filterNavigationItem(child, role, user))
                .filter(child => child !== null) as FuseNavigationItem[];
            if (filteredChildren.length > 0) {
                return {
                    ...item,
                    children: filteredChildren
                };
            }
        }

        return hasRolePermission || hasUserPermission ? item : null;
    }





    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(true);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {

        // Get the navigation
        const navigation =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                name,
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    isMobile(): boolean {
        const userAgent = navigator.userAgent || navigator.vendor;
        const isMobile = /android|iphone|ipad|ipod|opera mini|iemobile|windows phone|blackberry|kindle|silk/i.test(userAgent);
        return isMobile || window.innerWidth <= 768;
    }

    openFunction(name: string): void {
        if (this.isMobile()) {
            this.toggleNavigation(name);
        } else {
            this.toggleNavigationAppearance();
        }

    }
    /**
     * Toggle the navigation appearance
     */
    toggleNavigationAppearance(): void {
        this.navigationAppearance =
            this.navigationAppearance === 'default' ? 'dense' : 'default';
    }


    signOut(): void {
        this._router.navigate(['/sign-out']);
    }
}
