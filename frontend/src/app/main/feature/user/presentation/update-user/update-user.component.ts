import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../infrastructure/services/user.service';
import { UserRoleEnum, UserStatusEnum } from 'app/shared/domain/enums/user.enum';
import { getEnumOptions } from 'app/shared/infrastructure/helpers/user.utils';

@Component({
  selector: 'update-user-modal',
  templateUrl: './update-user.component.html',
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class UpdateUserModalComponent {
  form: FormGroup;
  roles = getEnumOptions(UserRoleEnum);
  statuses = getEnumOptions(UserStatusEnum);
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any },
    private userService: UserService
  ) {
    this.form = this.fb.group({
      username: [{ value: data.user.username, disabled: true }, Validators.required],
      dni: [{ value: data.user.dni, disabled: true }, Validators.required],
      fullName: [data.user.fullName, Validators.required],
      role: [data.user.role, Validators.required],
      status: [data.user.isActive ? UserStatusEnum.Active : UserStatusEnum.Inactive, Validators.required],
      password: [data.user.password, Validators.required]
    });
  }

  save(): void {
    if (!this.form.valid) return;
    this.isSaving = true;

    const updatedUser = {
      dni: this.data.user.dni,
      username: this.form.get('username')?.value,
      fullName: this.form.get('fullName')?.value,
      password: this.form.get('password')?.value,
      role: this.form.get('role')?.value,
      isActive: this.form.get('status')?.value === UserStatusEnum.Active
    };

    this.userService.update(this.data.user.dni, updatedUser).subscribe({
      next: () => this.dialogRef.close(updatedUser),
      error: () => this.isSaving = false
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
