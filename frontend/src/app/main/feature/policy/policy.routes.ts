import { Route } from '@angular/router';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        loadComponent: () =>
            import('./presentation/policy.component').then(
                (m) => m.PolicyComponent,
            ),
    },
];
