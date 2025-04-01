import { Route } from '@angular/router';
import { PolicyComponent } from './presentation/policy.component';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        children: [
            { path: '', component: PolicyComponent }
        ]
    },
];
