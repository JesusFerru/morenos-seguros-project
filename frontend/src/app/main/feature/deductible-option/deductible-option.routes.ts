import { Route } from '@angular/router';
import { DeductibleOptionComponent } from './presentation/deductible-option.component';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        children: [
            { path: '', component: DeductibleOptionComponent }
        ]
    },
];
