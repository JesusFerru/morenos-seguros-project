import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { InsurancePlanService } from '../../infrastructure/services/insurance-plan.service';
import { InsuranceCompanyService } from 'app/main/feature/insurance-company/infrastructure/services/insurance-company.service';
import { InsuranceCompanyModel } from 'app/main/feature/insurance-company/infrastructure/models/InsuranceCompanyModel';

@Component({
  selector: 'create-insurance-plan',
  standalone: true,
  templateUrl: './create-insurance-plan.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgFor,
    FuseAlertComponent,
  ],
})
export class CreateInsurancePlanComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateInsurancePlanComponent>);
  private planService = inject(InsurancePlanService);
  private companyService = inject(InsuranceCompanyService);

  form: FormGroup;
  companies: InsuranceCompanyModel[] = [];
  alert: { type: 'success' | 'error'; message: string } | null = null;
  isSaving = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      insuranceCompanyId: ['', Validators.required],
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
    if (this.form.invalid) return;
    this.isSaving = true;

    this.planService.create(this.form.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.alert = {
          type: 'error',
          message: 'Error al registrar el plan de seguro.',
        };
        this.isSaving = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
