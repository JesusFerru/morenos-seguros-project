// update-deductible-option.component.ts
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { InsurancePlanModel } from 'app/main/feature/insurance-plan/infrastructure/models/InsurancePlanModel';
import { DeductibleOptionService } from '../../infrastructure/services/deductible-option.service';
import { InsurancePlanService } from 'app/main/feature/insurance-plan/infrastructure/services/insurance-plan.service';
import { DeductibleOptionModel } from '../../infrastructure/models/DeductibleOptionModel';

@Component({
    selector: 'update-deductible-option',
    templateUrl: './update-deductible-option.component.html',
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
export class UpdateDeductibleOptionComponent {
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
        private dialogRef: MatDialogRef<UpdateDeductibleOptionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { deductible: DeductibleOptionModel },
        private deductibleService: DeductibleOptionService,
        private planService: InsurancePlanService
    ) {
        this.form = this.fb.group({
            deductible1: [data.deductible.deductible1, [Validators.required, Validators.min(0)]],
            deductible2: [data.deductible.deductible2, [Validators.required, Validators.min(0)]],
            currency: [data.deductible.currency, Validators.required],
            insurancePlanId: [data.deductible.insurancePlanId, Validators.required]
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
        const updated = this.form.value;

        this.deductibleService.update(this.data.deductible.id, updated).subscribe({
            next: () => this.dialogRef.close(updated),
            error: () => {
                this.alert = { type: 'error', message: 'Error al actualizar el deducible.' };
                this.isSaving = false;
            }
        });
    }

    close(): void {
        this.dialogRef.close();
    }
}
