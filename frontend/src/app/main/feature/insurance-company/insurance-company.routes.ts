import { Route } from '@angular/router';
import { InsuranceCompanyComponent } from './presentation/insurance-company.component';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        children: [
            { path: '', component: InsuranceCompanyComponent }
        ]
    },
];
