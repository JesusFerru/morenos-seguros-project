import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = () => {
    const router = inject(Router);

    // Check the authentication status
    return inject(AuthService).check().pipe(
        switchMap((authenticated: boolean) => {
            // If the user is not authenticated...
            if (!authenticated) {
                // Redirect to the sign-in page with a redirectUrl param
                return of(true);
            }

            // Allow the access
            const urlTree = router.parseUrl('/home');

            return of(urlTree);

        }),
    );


};
