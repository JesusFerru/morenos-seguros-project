import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { ClientService } from '../../infrastructure/services/client.service';

@Component({
  selector: 'create-client',
  standalone: true,
  templateUrl: './create-client.component.html',
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
export class CreateClientComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateClientComponent>);
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

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      nit: [''],
      businessName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      employmentStatus: [true],
      fundOrigin: ['', Validators.required],
      incomeRange: ['', Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.isSaving = true;

    this.clientService.create(this.form.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.alert = {
          type: 'error',
          message: 'Error al registrar el cliente.',
        };
        this.isSaving = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}