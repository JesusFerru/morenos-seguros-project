import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { BankService } from '../../infrastructure/services/bank.service';
import { BankAccountModel } from '../../infrastructure/models/BankAccountModel';

@Component({
  selector: 'update-bank',
  standalone: true,
  templateUrl: './update-bank.component.html',
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
export class UpdateBankComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UpdateBankComponent>);
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: { account: BankAccountModel }) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      bank: [this.data.account.bank, Validators.required],
      accountType: [this.data.account.accountType, Validators.required],
      accountNumber: [this.data.account.accountNumber, Validators.required],
      currency: [this.data.account.currency, Validators.required],
      holderName: [this.data.account.holderName, Validators.required],
    });
  }

  save(): void {
    if (!this.form.valid) return;
    this.isSaving = true;

    const updatedAccount = {
      bank: this.form.get('bank')?.value,
      accountType: this.form.get('accountType')?.value,
      accountNumber: this.form.get('accountNumber')?.value,
      currency: this.form.get('currency')?.value,
      holderName: this.form.get('holderName')?.value,
      isActive: this.data.account.isActive,
    };

    this.bankService.update(this.data.account.id, updatedAccount).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.alert = {
          type: 'error',
          message: 'Error al actualizar la cuenta bancaria.',
        };
        this.isSaving = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}