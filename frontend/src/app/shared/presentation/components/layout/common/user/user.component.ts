// import { BooleanInput } from '@angular/cdk/coercion';
// import { NgClass, NgIf } from '@angular/common';
// import {
//     ChangeDetectorRef,
//     Component,
//     Input,
//     OnDestroy,
//     OnInit,
// } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatIconModule } from '@angular/material/icon';
// import { MatMenuModule } from '@angular/material/menu';
// import { Router } from '@angular/router';
// import { User } from 'app/shared/infrastructure/helpers/user.types';
// import { Subject } from 'rxjs';

// @Component({
//     selector: 'ms-user',
//     standalone: true,
//     imports: [
//         MatButtonModule,
//         MatMenuModule,
//         NgIf,
//         MatIconModule,
//         NgClass,
//         MatDividerModule,
//     ],
//     templateUrl: './user.component.html',
// })
// export class UserComponent implements OnInit, OnDestroy {
//     /* eslint-disable @typescript-eslint/naming-convention */
//     static ngAcceptInputType_showAvatar: BooleanInput;
//     /* eslint-enable @typescript-eslint/naming-convention */

//     @Input() showAvatar: boolean = true;
//     user: User;

//     private _unsubscribeAll: Subject<any> = new Subject<any>();

//     /**
//      * Constructor
//      */
//     constructor(
//         private _changeDetectorRef: ChangeDetectorRef,
//         private _router: Router,
//     ) {}

//     // -----------------------------------------------------------------------------------------------------
//     // @ Lifecycle hooks
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * On init
//      */
//     ngOnInit(): void {
//         this.user = {
//           id: '1',
//           name: 'Nombre de Usuario',
//           email: 'usuario@example.com',
//           avatar: 'assets/images/avatars/brian-hughes.jpg',
//           status: 'activo'
//         };
//     }

//     /**
//      * On destroy
//      */
//     ngOnDestroy(): void {
//         // Unsubscribe from all subscriptions
//         this._unsubscribeAll.next(null);
//         this._unsubscribeAll.complete();
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------


//     /**
//      * Sign out
//      */
//     signOut(): void {
//         this._router.navigate(['/sign-out']);
//     }
// }
