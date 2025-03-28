import { Route } from '@angular/router';
import { SignOutComponent } from './sign-out.component';



export const CONTENT_ROUTES: Route[] = [
    {path: '',
      children: [
        { path: '', component: SignOutComponent}
      ]},
  ];
  