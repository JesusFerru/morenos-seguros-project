import { Route } from '@angular/router';
import { AuthGuard } from './shared/infrastructure/helpers/guards/auth.guard';
import { NoAuthGuard } from './shared/infrastructure/helpers/guards/noAuth.guard';
import { LayoutComponent } from './shared/presentation/components/layout/layout.component';

export const appRoutes: Route[] = [
    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'sign-in' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/main/feature/login/login.routes').then(
                        m => m.CONTENT_ROUTES,
                    ),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import(
                        'app/shared/presentation/components/layout/common/sign-out/sign-out.routes'
                    ).then(m => m.CONTENT_ROUTES),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'dense',
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/main/feature/home/home.routes').then(
                        m => m.CONTENT_ROUTES,
                    ),
            },
            {
                path: 'user',
                loadChildren: () =>
                    import(
                        'app/main/feature/user/user.routes'
                    ).then(m => m.CONTENT_ROUTES),
            },

            {
                path: 'insurance-company',
                loadChildren: () =>
                    import(
                        'app/main/feature/insurance-company/insurance-company.routes'
                    ).then(m => m.CONTENT_ROUTES),
            },
        ],
    },
];
