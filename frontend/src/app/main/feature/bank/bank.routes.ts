import { Route } from '@angular/router';
import { BankComponent } from './presentation/bank.component';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        children: [
            { path: '', component: BankComponent }
        ]
    },
];