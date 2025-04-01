import {Route} from '@angular/router';
import { LoginComponent } from './presentation/login/login.component';


export const CONTENT_ROUTES: Route[] = [
  {path: '',
    children: [
      { path: '', component: LoginComponent}
    ]},
];


