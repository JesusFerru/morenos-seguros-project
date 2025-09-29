import { Route } from '@angular/router';
import { PolicyMemberComponent } from './presentation/policy-member.component';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        children: [
            { path: '', component: PolicyMemberComponent }
        ]
    },
];