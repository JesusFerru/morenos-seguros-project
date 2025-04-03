import { Route } from '@angular/router';
import { LogsNetbaseComponent } from './presentation/logs-netbase/logs-netbase.component';

export const CONTENT_ROUTES: Route[] = [
    {
        path: '',
        children: [
            { path: '', component: LogsNetbaseComponent }
        ]
    },
];
