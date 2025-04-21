import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { InsurancePlanService } from '../../infrastructure/services/insurance-plan.service';
import { InsuranceCompanyService } from 'app/main/feature/insurance-company/infrastructure/services/insurance-company.service';
import { InsuranceCompanyModel } from 'app/main/feature/insurance-company/infrastructure/models/InsuranceCompanyModel';
import { InsurancePlanModel } from '../../infrastructure/models/InsurancePlanModel';

@Component({
  selector: 'update-insurance-plan',
  standalone: true,
  templateUrl: './update-insurance-plan.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgIf,
    NgFor,
    FuseAlertComponent,
  ],
})
export class UpdateInsurancePlanComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UpdateInsurancePlanComponent>);
  private planService = inject(InsurancePlanService);
  private companyService = inject(InsuranceCompanyService);

  form: FormGroup;
  companies: InsuranceCompanyModel[] = [];
  alert: { type: 'success' | 'error'; message: string } | null = null;
  isSaving = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { plan: InsurancePlanModel }) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data.plan.name, Validators.required],
      description: [this.data.plan.description, Validators.required],
      insuranceCompanyId: [this.data.plan.insuranceCompanyId, Validators.required],
    });

    this.companyService.getActive().subscribe({
      next: (res) => {
        this.companies = res;
      },
      error: () => {
        this.alert = {
          type: 'error',
          message: 'No se pudieron cargar las compañías activas.',
        };
      },
    });
  }

  save(): void {
    if (!this.form.valid) return;
    this.isSaving = true;

    this.planService.update(this.data.plan.id, this.form.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.alert = {
          type: 'error',
          message: 'Error al actualizar el plan.',
        };
        this.isSaving = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
