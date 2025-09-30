import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { InsurancePlanModel } from 'app/main/feature/insurance-plan/infrastructure/models/InsurancePlanModel';
import { DeductibleOptionService } from '../../infrastructure/services/deductible-option.service';
import { InsurancePlanService } from 'app/main/feature/insurance-plan/infrastructure/services/insurance-plan.service';

@Component({
    selector: 'create-deductible-option',
    templateUrl: './create-deductible-option.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        NgIf,
        NgFor,
        FuseAlertComponent
    ]
})
export class CreateDeductibleOptionComponent {
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
        private dialogRef: MatDialogRef<CreateDeductibleOptionComponent>,
        private deductibleService: DeductibleOptionService,
        private planService: InsurancePlanService
    ) {
        this.form = this.fb.group({
            deductible1: [null, [Validators.required, Validators.min(0)]],
            deductible2: [null, [Validators.required, Validators.min(0)]],
            currency: [null, Validators.required],
            insurancePlanId: [null, Validators.required]
        });

        this.loadPlans();
    }

    private loadPlans(): void {
        this.planService.getActive().subscribe({
            next: (res) => this.plans = res,
            error: () => this.alert = {
                type: 'error',
                message: 'No se pudieron cargar los planes activos.'
            }
        });
    }

    save(): void {
        if (!this.form.valid) return;

        this.isSaving = true;
        const payload = this.form.value;

        this.deductibleService.create(payload).subscribe({
            next: () => this.dialogRef.close(payload),
            error: () => {
                this.alert = {
                    type: 'error',
                    message: 'Error al crear deducible.',
                };
                this.isSaving = false;
            }
        });
    }

    close(): void {
        this.dialogRef.close();
    }
}
