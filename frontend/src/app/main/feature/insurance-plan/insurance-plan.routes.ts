import { Route } from '@angular/router';
import { InsurancePlanComponent } from './presentation/insurance-plan.component';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        children: [
            { path: '', component: InsurancePlanComponent }
        ]
    },
];
