import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { InsuranceCompanyService } from '../../../infrastructure/services/insurance-company.service';

@Component({
  selector: 'app-create-insurance-company',
  standalone: true,
  templateUrl: './create-insurance-company.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class CreateInsuranceCompanyComponent {
  form: FormGroup;
  isSaving = false;
  alert: { type: 'success' | 'error'; message: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateInsuranceCompanyComponent>,
    private insuranceCompanyService: InsuranceCompanyService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', ]
    });
  }

  save(): void {
    if (!this.form.valid) return;

    this.isSaving = true;
    const payload = this.form.value;

    this.insuranceCompanyService.create(payload).subscribe({
      next: (company) => this.dialogRef.close(company),
      error: () => {
        this.alert = {
          type: 'error',
          message: 'Error al crear la compañía de seguros.',
        };
        this.isSaving = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
