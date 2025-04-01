import { Route } from '@angular/router';
import { EventComponent } from './presentation/event.component';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        children: [
            { path: '', component: EventComponent }
        ]
    },
];
