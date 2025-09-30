import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
import { PolicyModel } from '../../infrastructure/models/PolicyModel';

@Component({
  selector: 'update-policy',
  standalone: true,
  templateUrl: './update-policy.component.html',
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
export class UpdatePolicyComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UpdatePolicyComponent>);
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
    { value: 'Activa', label: 'Activa' },
    { value: 'Inactiva', label: 'Inactiva' },
    { value: 'Vencida', label: 'Vencida' },
    { value: 'Cancelada', label: 'Cancelada' },
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { policy: PolicyModel }) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      policyNumber: [this.data.policy.policyNumber, Validators.required],
      previousPolicyNumber: [this.data.policy.previousPolicyNumber],
      titularClientId: [this.data.policy.titularClientId, Validators.required],
      agentId: [this.data.policy.agentId, Validators.required],
      startDate: [new Date(this.data.policy.startDate), Validators.required],
      endDate: [new Date(this.data.policy.endDate), Validators.required],
      deductibleOptionId: [this.data.policy.deductibleOptionId, Validators.required],
      status: [this.data.policy.status, Validators.required],
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
    if (!this.form.valid) return;
    this.isSaving = true;

    const formValue = this.form.value;
    const payload = {
      ...formValue,
      startDate: new Date(formValue.startDate).toISOString().split('T')[0],
      endDate: new Date(formValue.endDate).toISOString().split('T')[0],
    };

    this.policyService.update(this.data.policy.id, payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.alert = {
          type: 'error',
          message: 'Error al actualizar la póliza.',
        };
        this.isSaving = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
