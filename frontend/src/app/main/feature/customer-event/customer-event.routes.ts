import { Route } from '@angular/router';
import { CustomerEventComponent } from './presentation/customer-event.component';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        children: [
            { path: '', component: CustomerEventComponent }
        ]
    },
];
