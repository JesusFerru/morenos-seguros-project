import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgIf, NgFor } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { PolicyService } from '../../infrastructure/services/policy.service';
import { ClientService } from 'app/main/feature/client/infrastructure/services/client.service';
import { DeductibleOptionService } from 'app/main/feature/deductible-option/infrastructure/services/deductible-option.service';
import { ClientModel } from 'app/main/feature/client/infrastructure/models/ClientModel';
import { DeductibleOptionModel } from 'app/main/feature/deductible-option/infrastructure/models/DeductibleOptionModel';
import { UserService } from 'app/main/feature/user/infrastructure/services/user.service';
import { UserModel } from 'app/main/feature/user/infrastructure/models/UserModel';

@Component({
  selector: 'create-policy',
  standalone: true,
  templateUrl: './create-policy.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgIf,
    NgFor,
    FuseAlertComponent,
  ],
})
export class CreatePolicyComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreatePolicyComponent>);
  private policyService = inject(PolicyService);
  private clientService = inject(ClientService);
  private deductibleService = inject(DeductibleOptionService);
  private userService = inject(UserService);

  form: FormGroup;
  clients: ClientModel[] = [];
  agents: UserModel[] = [];
  deductibleOptions: DeductibleOptionModel[] = [];
  alert: { type: 'success' | 'error'; message: string } | null = null;
  isSaving = false;

  // Predefined options for selects
  statusOptions = [
    { value: 0, label: 'Borrador' },           // Draft
    { value: 1, label: 'Activa' },             // Active
    { value: 2, label: 'Pendiente de Pago' },  // PendingPayment
    { value: 3, label: 'Cancelada' },          // Cancelled
    { value: 4, label: 'Vencida' },            // Expired
    { value: 5, label: 'Suspendida' }          // Suspended
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      policyNumber: ['', Validators.required],
      previousPolicyNumber: [''],
      titularClientId: ['', Validators.required],
      agentId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      deductibleOptionId: ['', Validators.required],
      status: ['Activa', Validators.required],
    });

    this.loadClients();
    this.loadAgents();
    this.loadDeductibleOptions();
  }

  private loadClients(): void {
    this.clientService.getActive().subscribe({
      next: (res) => {
        this.clients = res;
      },
      error: () => {
        this.alert = {
          type: 'error',
          message: 'No se pudieron cargar los clientes activos.',
        };
      },
    });
  }

  private loadAgents(): void {
    // Assuming we have a method to get users with agent role
    this.userService.getAll().subscribe({
      next: (res) => {
        this.agents = res.filter(user => user.role === 'Agent' || user.role === 'Admin');
      },

      error: () => {
        this.alert = {
          type: 'error',
          message: 'No se pudieron cargar los agentes.',
        };
      },
    });
  }

  private loadDeductibleOptions(): void {
    this.deductibleService.getActive().subscribe({
      next: (res) => {
        this.deductibleOptions = res;
      },
      error: () => {
        this.alert = {
          type: 'error',
          message: 'No se pudieron cargar las opciones de deducible.',
        };
      },
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.isSaving = true;

    const formValue = this.form.value;
    const payload = {
      ...formValue,
      startDate: new Date(formValue.startDate).toISOString().split('T')[0],
      endDate: new Date(formValue.endDate).toISOString().split('T')[0],
    };

    this.policyService.create(payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.alert = {
          type: 'error',
          message: 'Error al registrar la póliza.',
        };
        this.isSaving = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
