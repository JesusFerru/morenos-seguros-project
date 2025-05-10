// update-deductible-option.component.ts
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FuseAlertComponent } from '@fuse/components/alert';
import { InsurancePlanModel } from 'app/main/feature/insurance-plan/infrastructure/models/InsurancePlanModel';
import { CustomerService } from '../../infrastructure/services/customer.service';
import { InsurancePlanService } from 'app/main/feature/insurance-plan/infrastructure/services/insurance-plan.service';
import { CustomerModel } from '../../infrastructure/models/CustomerModel';

@Component({
    selector: 'update-customer',
    templateUrl: './update-customer.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        NgIf,
        FuseAlertComponent
    ]
})
export class UpdateCustomerComponent {
    form: FormGroup;
    isSaving = false;
    alert: { type: 'success' | 'error'; message: string } | null = null;
    plans: InsurancePlanModel[] = [];
    currencies = [
        { value: 'USD', label: 'Dólares' },
        { value: 'BS', label: 'Bolivianos' }
    ];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<UpdateCustomerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { customer: CustomerModel },
        private service: CustomerService,
        private planService: InsurancePlanService
    ) {
      this.form = this.fb.group({
        firstName: [data.customer.firstName, Validators.required],
        lastName: [data.customer.lastName, Validators.required],
        nit: [data.customer.nit, Validators.required],
        businessName: [data.customer.businessName, Validators.required],
        documentType: [data.customer.documentType || 'CI'],
        documentNumber: [data.customer.documentNumber, Validators.required],
        phoneNumber: [data.customer.phoneNumber, Validators.required],
        email: [data.customer.email, [Validators.email]],
        city: [data.customer.city],
        address: [data.customer.address],
        fundOrigin: [data.customer.fundOrigin, Validators.required],
        incomeRange: [data.customer.incomeRange, Validators.required],
        birthDate: [data.customer.birthDate ? new Date(data.customer.birthDate) : null],
        employmentStatus: [data.customer.employmentStatus],
        isActive: [data.customer.isActive]
    });
    

        this.load();
    }

    private load(): void {
        this.planService.getActive().subscribe({
            next: (res) => this.plans = res,
            error: () => this.alert = {
                type: 'error',
                message: 'No se pudieron cargar los clientes.'
            }
        });
    }

    save(): void {
        if (!this.form.valid) return;

        this.isSaving = true;
        const updated = this.form.value;

        this.service.update(this.data.customer.id, updated).subscribe({
            next: () => this.dialogRef.close(updated),
            error: () => {
                this.alert = { type: 'error', message: 'Error al actualizar el cliente.' };
                this.isSaving = false;
            }
        });
    }

    close(): void {
        this.dialogRef.close();
    }
}
