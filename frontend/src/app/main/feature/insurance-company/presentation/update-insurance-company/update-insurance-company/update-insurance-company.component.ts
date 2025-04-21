import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { InsuranceCompanyService } from '../../../infrastructure/services/insurance-company.service';

@Component({
  selector: 'app-update-insurance-company',
  standalone: true,
  templateUrl: './update-insurance-company.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class UpdateInsuranceCompanyComponent {
  form: FormGroup;
  isSaving = false;
  alert: { type: 'success' | 'error'; message: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateInsuranceCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { company: any },
    private insuranceCompanyService: InsuranceCompanyService
  ) {
    this.form = this.fb.group({
      name: [data.company.name, Validators.required],
      description: [data.company.description, Validators.required]
    });
  }

  save(): void {
    if (!this.form.valid) return;

    this.isSaving = true;
    const payload = this.form.value;

    this.insuranceCompanyService.update(this.data.company.id, payload).subscribe({
      next: (updatedCompany) => this.dialogRef.close(updatedCompany),
      error: () => {
        this.alert = {
          type: 'error',
          message: 'Error al actualizar la compañía de seguros.',
        };
        this.isSaving = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
