import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { PaymentService } from '../../infrastructure/services/payment.service';
import { PaymentModel } from '../../infrastructure/models/PaymentModel';

@Component({
  selector: 'update-payment',
  standalone: true,
  templateUrl: './update-payment.component.html',
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
export class UpdatePaymentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UpdatePaymentComponent>);
  private paymentService = inject(PaymentService);

  form: FormGroup;
  alert: { type: 'success' | 'error'; message: string } | null = null;
  isSaving = false;

  // Predefined options for selects
  paymentMethods = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria' },
    { value: 'TARJETA_CREDITO', label: 'Tarjeta de Crédito' },
    { value: 'TARJETA_DEBITO', label: 'Tarjeta de Débito' },
    { value: 'CHEQUE', label: 'Cheque' }
  ];

  periods = [
    { value: 'MENSUAL', label: 'Mensual' },
    { value: 'TRIMESTRAL', label: 'Trimestral' },
    { value: 'SEMESTRAL', label: 'Semestral' },
    { value: 'ANUAL', label: 'Anual' },
    { value: 'UNICO', label: 'Pago Único' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { payment: PaymentModel }) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      policyNumber: [this.data.payment.policyNumber, Validators.required],
      paymentDate: [this.data.payment.paymentDate, Validators.required],
      period: [this.data.payment.period, Validators.required],
      paymentMethod: [this.data.payment.paymentMethod, Validators.required],
      amount: [this.data.payment.amount, [Validators.required, Validators.min(0.01)]],
      receiptUrl: [this.data.payment.receiptUrl],
    });
  }

  save(): void {
    if (!this.form.valid) return;
    this.isSaving = true;

    const updatedPayment = {
      policyNumber: this.form.get('policyNumber')?.value,
      paymentDate: this.form.get('paymentDate')?.value,
      period: this.form.get('period')?.value,
      paymentMethod: this.form.get('paymentMethod')?.value,
      amount: this.form.get('amount')?.value,
      receiptUrl: this.form.get('receiptUrl')?.value,
      isActive: this.data.payment.isActive,
    };

    this.paymentService.update(this.data.payment.id, updatedPayment).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.alert = {
          type: 'error',
          message: 'Error al actualizar el pago.',
        };
        this.isSaving = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}