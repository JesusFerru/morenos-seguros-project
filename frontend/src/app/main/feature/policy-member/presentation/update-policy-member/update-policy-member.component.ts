import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { PolicyMemberService } from '../../infrastructure/services/policy-member.service';
import { PolicyMemberModel } from '../../infrastructure/models/PolicyMemberModel';
import { ClientService } from 'app/main/feature/client/infrastructure/services/client.service';
import { InsurancePlanService } from 'app/main/feature/insurance-plan/infrastructure/services/insurance-plan.service';
import { ClientModel } from 'app/main/feature/client/infrastructure/models/ClientModel';
import { InsurancePlanModel } from 'app/main/feature/insurance-plan/infrastructure/models/InsurancePlanModel';

@Component({
  selector: 'update-policy-member',
  standalone: true,
  templateUrl: './update-policy-member.component.html',
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
export class UpdatePolicyMemberComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UpdatePolicyMemberComponent>);
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: { member: PolicyMemberModel }) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      isTitular: [this.data.member.isTitular],
      entryDate: [this.data.member.entryDate, Validators.required],
      status: [this.data.member.status, Validators.required],
      exclusions: [this.data.member.exclusions],
      memberType: [this.data.member.memberType, Validators.required],
      clientId: [this.data.member.clientId, Validators.required],
      policyId: [this.data.member.policyId, Validators.required],
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
    if (!this.form.valid) return;
    this.isSaving = true;

    const updatedMember = {
      isTitular: this.form.get('isTitular')?.value,
      entryDate: this.form.get('entryDate')?.value,
      status: this.form.get('status')?.value,
      exclusions: this.form.get('exclusions')?.value,
      memberType: this.form.get('memberType')?.value,
      clientId: this.form.get('clientId')?.value,
      policyId: this.form.get('policyId')?.value,
      isActive: this.data.member.isActive,
    };

    this.policyMemberService.update(this.data.member.id, updatedMember).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.alert = {
          type: 'error',
          message: 'Error al actualizar el miembro de póliza.',
        };
        this.isSaving = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}