import { NgIf } from '@angular/common';
import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from '../../../../../shared/infrastructure/services/auth.service';
import { WhiteListService } from '../../infrastructure/models/white-list.service';

@Component({
    selector: 'ms-login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
    FuseAlertComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
],
})
export class LoginComponent implements OnInit {
    //Inject
    _authService = inject(AuthService);
    _formBuilder = inject(UntypedFormBuilder);
    _activatedRoute = inject(ActivatedRoute);
    _router = inject(Router);
    _whiteList = inject(WhiteListService);
    isSandboxEnvironment: boolean = false;

    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;

    ngOnInit(): void {
        this._authService.cleanLocalStorage();
        // Create the form
        this.signInForm = this._formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', Validators.required]
        });


    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        const value = this.signInForm.value;

        // Validate User White List
        if (!this._whiteList.isTSOUser(value.user)) {
            this.signInForm.enable();

            // Set the alert
            this.alert = {
                type: 'error',
                message: 'El Usuario no se encuentra habilitado.',
            };

            // Show the alert
            this.showAlert = true;

            return;
        }

        // Sign in
        this._authService.login(value).subscribe({
            next: () => {
                this._router.navigateByUrl('/home');
            },
            error: (error) => {
                this.signInForm.enable();
                this.signInNgForm.resetForm();

                const message =
                    error?.error?.message ||
                    error?.message ||
                    'Ocurrió un error inesperado. Por favor, intente de nuevo.';

                this.alert = {
                    type: 'error',
                    message,
                };

                this.showAlert = true;
            }

        });
    }

    reloadPage(): void {
        window.location.reload();
    }
}
