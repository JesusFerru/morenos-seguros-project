import { Route } from '@angular/router';
import { OriginComponent } from './presentation/origin.component';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        children: [
            { path: '', component: OriginComponent }
        ]
    },
];
