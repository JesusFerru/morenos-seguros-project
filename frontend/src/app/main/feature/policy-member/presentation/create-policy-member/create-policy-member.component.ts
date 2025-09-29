import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { PolicyMemberService } from '../../infrastructure/services/policy-member.service';
import { ClientService } from 'app/main/feature/client/infrastructure/services/client.service';
import { InsurancePlanService } from 'app/main/feature/insurance-plan/infrastructure/services/insurance-plan.service';
import { ClientModel } from 'app/main/feature/client/infrastructure/models/ClientModel';
import { InsurancePlanModel } from 'app/main/feature/insurance-plan/infrastructure/models/InsurancePlanModel';

@Component({
  selector: 'create-policy-member',
  standalone: true,
  templateUrl: './create-policy-member.component.html',
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
export class CreatePolicyMemberComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreatePolicyMemberComponent>);
  private policyMemberService = inject(PolicyMemberService);
  private clientService = inject(ClientService);
  private insurancePlanService = inject(InsurancePlanService);

  form: FormGroup;
  alert: { type: 'success' | 'error'; message: string } | null = null;
  isSaving = false;
  clients: ClientModel[] = [];
  policies: InsurancePlanModel[] = [];

  // Predefined options for selects
  memberTypes = [
    { value: 'TITULAR', label: 'Titular' },
    { value: 'BENEFICIARIO', label: 'Beneficiario' },
    { value: 'DEPENDIENTE', label: 'Dependiente' }
  ];

  statuses = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'SUSPENDIDO', label: 'Suspendido' },
    { value: 'CANCELADO', label: 'Cancelado' },
    { value: 'VENCIDO', label: 'Vencido' }
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      isTitular: [false],
      entryDate: ['', Validators.required],
      status: ['', Validators.required],
      exclusions: [''],
      memberType: ['', Validators.required],
      clientId: ['', Validators.required],
      policyId: ['', Validators.required],
    });

    this.loadClients();
    this.loadPolicies();
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (res) => {
        this.clients = res;
      },
      error: () => {
        this.alert = {
          type: 'error',
          message: 'No se pudieron cargar los clientes.',
        };
      },
    });
  }

  loadPolicies(): void {
    this.insurancePlanService.getAll().subscribe({
      next: (res) => {
        this.policies = res;
      },
      error: () => {
        this.alert = {
          type: 'error',
          message: 'No se pudieron cargar las pólizas.',
        };
      },
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.isSaving = true;

    this.policyMemberService.create(this.form.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.alert = {
          type: 'error',
          message: 'Error al registrar el miembro de póliza.',
        };
        this.isSaving = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}