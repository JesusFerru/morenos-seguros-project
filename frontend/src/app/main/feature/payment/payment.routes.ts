import { Route } from '@angular/router';
import { PaymentComponent } from './presentation/payment.component';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        children: [
            { path: '', component: PaymentComponent }
        ]
    },
];