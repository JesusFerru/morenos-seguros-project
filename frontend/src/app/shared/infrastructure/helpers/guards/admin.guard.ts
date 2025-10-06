import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { map, of, switchMap, take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UserRoleEnum } from '../../../domain/enums/user.enum';

export const AdminGuard: CanActivateFn | CanActivateChildFn = () => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const userService = inject(UserService);

    // First check authentication, then check role
    return authService.check().pipe(
        switchMap((authenticated: boolean) => {
            if (!authenticated) {
                const urlTree = router.parseUrl('/sign-in');
                return of(urlTree);
            }

            // Check if user has admin role - take only the first emission
            return userService.user$.pipe(
                take(1), // Ensure we only take the first user value
                map(user => {
                    if (user?.roleUser === UserRoleEnum.Admin) {
                        return true;
                    } else {
                        // Redirect to home if not admin
                        const urlTree = router.parseUrl('/home');
                        return urlTree;
                    }
                })
            );
        })
    );
};