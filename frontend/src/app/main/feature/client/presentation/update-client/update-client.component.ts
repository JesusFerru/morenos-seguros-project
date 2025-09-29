import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { ClientService } from '../../infrastructure/services/client.service';
import { ClientModel } from '../../infrastructure/models/ClientModel';

@Component({
  selector: 'update-client',
  standalone: true,
  templateUrl: './update-client.component.html',
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
export class UpdateClientComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UpdateClientComponent>);
  private clientService = inject(ClientService);

  form: FormGroup;
  alert: { type: 'success' | 'error'; message: string } | null = null;
  isSaving = false;

  // Predefined options for selects
  documentTypes = [
    { value: 'Ci', label: 'Cédula de Identidad' },
    { value: 'Passport', label: 'Pasaporte' }
  ];

  incomeRanges = [
    { value: 'BAJO', label: 'Bajo (0 - $500)' },
    { value: 'BAJO-MEDIO', label: 'Medio Bajo ($500 - $1000)' },
    { value: 'MEDIO', label: 'Medio ($1000 - $2500)' },
    { value: 'MEDIO-ALTO', label: 'Medio Alto ($2500 - $5000)' },
    { value: 'ALTO', label: 'Alto ($5000+)' }
  ];

  fundOrigins = [
    { value: 'SALARIO', label: 'Salario' },
    { value: 'NEGOCIO', label: 'Negocio Propio' },
    { value: 'INVERSIONES', label: 'Inversiones' },
    { value: 'HERENCIA', label: 'Herencia' },
    { value: 'OTRO', label: 'Otro' }
  ];
  cities = [
    { value: 'BENI', label: 'Beni' },
    { value: 'COCHABAMBA', label: 'Cochabamba' },
    { value: 'EL_ALTO', label: 'El Alto' },
    { value: 'LA_PAZ', label: 'La Paz' },
    { value: 'ORURO', label: 'Oruro' },
    { value: 'PANDO', label: 'Pando' },
    { value: 'POTOSI', label: 'Potosí' },
    { value: 'SANTA_CRUZ', label: 'Santa Cruz' },
    { value: 'SUCRE', label: 'Sucre' },
    { value: 'TARIJA', label: 'Tarija' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { client: ClientModel }) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [this.data.client.firstName, Validators.required],
      lastName: [this.data.client.lastName, Validators.required],
      birthDate: [this.data.client.birthDate, Validators.required],
      nit: [this.data.client.nit],
      businessName: [this.data.client.businessName],
      email: [this.data.client.email, [Validators.required, Validators.email]],
      phoneNumber: [this.data.client.phoneNumber, Validators.required],
      documentType: [this.data.client.documentType, Validators.required],
      documentNumber: [this.data.client.documentNumber, Validators.required],
      city: [this.data.client.city, Validators.required],
      address: [this.data.client.address, Validators.required],
      employmentStatus: [this.data.client.employmentStatus],
      fundOrigin: [this.data.client.fundOrigin, Validators.required],
      incomeRange: [this.data.client.incomeRange, Validators.required],
    });
  }

  save(): void {
    if (!this.form.valid) return;
    this.isSaving = true;

    const updatedClient = {
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      birthDate: this.form.get('birthDate')?.value,
      nit: this.form.get('nit')?.value,
      businessName: this.form.get('businessName')?.value,
      email: this.form.get('email')?.value,
      phoneNumber: this.form.get('phoneNumber')?.value,
      documentType: this.form.get('documentType')?.value,
      documentNumber: this.form.get('documentNumber')?.value,
      city: this.form.get('city')?.value,
      address: this.form.get('address')?.value,
      employmentStatus: this.form.get('employmentStatus')?.value,
      fundOrigin: this.form.get('fundOrigin')?.value,
      incomeRange: this.form.get('incomeRange')?.value,
      isActive: this.data.client.isActive,
    };

    this.clientService.update(this.data.client.id, updatedClient).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.alert = {
          type: 'error',
          message: 'Error al actualizar el cliente.',
        };
        this.isSaving = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}