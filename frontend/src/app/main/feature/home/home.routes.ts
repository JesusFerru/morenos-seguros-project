import { Route } from '@angular/router';
import { DashboardComponent } from './presentation/dashboard/dashboard.component';


export const CONTENT_ROUTES: Route[] = [
    {path: '',
      children: [
        { path: '', component: DashboardComponent},
      ]},
  ];
  