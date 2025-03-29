import { Route } from '@angular/router';
import { UserComponent } from './presentation/user.component';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        children: [
            { path: '', component: UserComponent }
        ]
    },
];
