import { Route } from '@angular/router';
import { ClientComponent } from './presentation/client.component';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        children: [
            { path: '', component: ClientComponent }
        ]
    },
];