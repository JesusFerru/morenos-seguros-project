import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { PaymentService } from '../../infrastructure/services/payment.service';

@Component({
  selector: 'create-payment',
  standalone: true,
  templateUrl: './create-payment.component.html',
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
export class CreatePaymentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreatePaymentComponent>);
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

  ngOnInit(): void {
    this.form = this.fb.group({
      policyNumber: ['', Validators.required],
      paymentDate: ['', Validators.required],
      period: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      receiptUrl: [''],
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.isSaving = true;

    this.paymentService.create(this.form.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.alert = {
          type: 'error',
          message: 'Error al registrar el pago.',
        };
        this.isSaving = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}