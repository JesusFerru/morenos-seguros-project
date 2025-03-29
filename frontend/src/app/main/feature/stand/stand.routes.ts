import { Route } from '@angular/router';
import { StandComponent } from './presentation/stand.component';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        children: [
            { path: '', component: StandComponent }
        ]
    },
];
