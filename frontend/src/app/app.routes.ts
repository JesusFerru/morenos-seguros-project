import { Route } from '@angular/router';
import { AuthGuard } from './shared/infrastructure/helpers/guards/auth.guard';
import { AdminGuard } from './shared/infrastructure/helpers/guards/admin.guard';
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
            // Redirect authenticated users to home
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            {
                path: 'home',
                loadChildren: () =>
                    import('app/main/feature/home/home.routes').then(
                        m => m.CONTENT_ROUTES,
                    ),
            },
            {
                path: 'usuarios',
                canActivate: [AdminGuard],
                canActivateChild: [AdminGuard],
                loadChildren: () =>
                    import(
                        'app/main/feature/user/user.routes'
                    ).then(m => m.CONTENT_ROUTES),
            },

            {
                path: 'compañias',
                loadChildren: () =>
                    import(
                        'app/main/feature/insurance-company/insurance-company.routes'
                    ).then(m => m.CONTENT_ROUTES),
            },

            {
                path: 'planes',
                loadChildren: () =>
                    import(
                        'app/main/feature/insurance-plan/insurance-plan.routes'
                    ).then(m => m.CONTENT_ROUTES),
            },

            {
                path: 'deducibles',
                loadChildren: () =>
                    import(
                        'app/main/feature/deductible-option/deductible-option.routes'
                    ).then(m => m.CONTENT_ROUTES),
            },

            {
                path: 'bancos',
                loadChildren: () =>
                    import(
                        'app/main/feature/bank/bank.routes'
                    ).then(m => m.CONTENT_ROUTES),
            },

            {
                path: 'clientes',
                loadChildren: () =>
                    import(
                        'app/main/feature/client/client.routes'
                    ).then(m => m.CONTENT_ROUTES),
            },

            {
                path: 'polizas',
                loadChildren: () =>
                    import(
                        'app/main/feature/policy/policy.routes'
                    ).then(m => m.CONTENT_ROUTES),
            },

            {
                path: 'miembros-poliza',
                loadChildren: () =>
                    import(
                        'app/main/feature/policy-member/policy-member.routes'
                    ).then(m => m.CONTENT_ROUTES),
            },

            {
                path: 'pagos',
                loadChildren: () =>
                    import(
                        'app/main/feature/payment/payment.routes'
                    ).then(m => m.CONTENT_ROUTES),
            }
        ],
    },
];
