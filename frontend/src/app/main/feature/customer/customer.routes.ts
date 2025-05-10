import { Route } from '@angular/router';
import { CustomerComponent } from './customer.component';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        children: [
            { path: '', component: CustomerComponent }
        ]
    },
];
