import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { BankService } from '../../infrastructure/services/bank.service';

@Component({
  selector: 'create-bank',
  standalone: true,
  templateUrl: './create-bank.component.html',
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
export class CreateBankComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateBankComponent>);
  private bankService = inject(BankService);

  form: FormGroup;
  alert: { type: 'success' | 'error'; message: string } | null = null;
  isSaving = false;

  // Predefined options for selects
  accountTypes = [
    { value: 'Cuenta Corriente', label: 'Cuenta Corriente' },
    { value: 'Cuenta de Ahorros', label: 'Cuenta de Ahorros' },
  ];

  currencies = [
    { value: 'BS', label: 'Bolivianos (Bs.)' },
    { value: 'USD', label: 'Dólar Americano (USD)' },
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      bank: ['', Validators.required],
      accountType: ['', Validators.required],
      accountNumber: ['', Validators.required],
      currency: ['', Validators.required],
      holderName: ['', Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.isSaving = true;

    this.bankService.create(this.form.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.alert = {
          type: 'error',
          message: 'Error al registrar la cuenta bancaria.',
        };
        this.isSaving = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}