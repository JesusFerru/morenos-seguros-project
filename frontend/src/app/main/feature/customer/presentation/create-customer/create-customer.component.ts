import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { InsurancePlanModel } from 'app/main/feature/insurance-plan/infrastructure/models/InsurancePlanModel';
import { InsurancePlanService } from 'app/main/feature/insurance-plan/infrastructure/services/insurance-plan.service';
import { CustomerService } from '../../infrastructure/services/customer.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'ms-create-customer',
    templateUrl: './create-customer.component.html',
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
        FuseAlertComponent,
        NgClass
    ]
})
export class CreateCustomerComponent {
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
        private dialogRef: MatDialogRef<CreateCustomerComponent>,
        private service: CustomerService,
        private planService: InsurancePlanService
    ) {
      this.form = this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        nit: [null, Validators.required],
        businessName: [null, Validators.required],
        documentType: ["CI"],
        documentNumber: [null, Validators.required],
        phoneNumber: [null, Validators.required],
        email: [null, [Validators.email]],
        city: [null],
        address: [null],
        fundOrigin: [null, Validators.required],
        incomeRange: [null, Validators.required],
        birthDate: [null],
        employmentStatus: [true],
        isActive: [true]
    });
    

        this.load();
    }

    private load(): void {
        this.planService.getActive().subscribe({
            next: (res) => this.plans = res,
            error: () => this.alert = {
                type: 'error',
                message: 'No se pudieron cargar los clientes activos.'
            }
        });
    }

    save(): void {
        if (!this.form.valid) return;
    
        this.isSaving = true;
    
        const rawValue = this.form.value;
        const birthDate = rawValue.birthDate instanceof Date
        ? rawValue.birthDate.toISOString().split('T')[0]
        : null;
      
      const payload = {
        ...rawValue,
        birthDate
      };
    
        this.service.create(payload).subscribe({
            next: () => this.dialogRef.close(payload),
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error al crear cliente.',
                };
                this.isSaving = false;
            }
        });
    }

    close(): void {
        this.dialogRef.close();
    }
}
