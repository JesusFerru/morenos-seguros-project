import { UserRoleEnum, UserStatusEnum } from 'app/shared/domain/enums/user.enum';

const roleLabels: Record<UserRoleEnum, string> = {
    [UserRoleEnum.Admin]: 'Administrador',
    [UserRoleEnum.Collaborator]: 'Colaborador',
};

const statusLabels: Record<UserStatusEnum, string> = {
    [UserStatusEnum.Active]: 'Activo',
    [UserStatusEnum.Inactive]: 'Inactivo',
};

export function getEnumOptions<T extends object>(
    enumObj: T,
    labelMap?: Record<string, string>
): { value: string; label: string }[] {
    return Object.entries(enumObj).map(([_, value]) => ({
        value: value as string,
        label: labelMap?.[value as string] ?? value,
    }));
}

export function getTranslatedRole(value: string): string {
    const map: Record<UserRoleEnum, string> = {
        [UserRoleEnum.Admin]: 'Administrador',
        [UserRoleEnum.Collaborator]: 'Colaborador',
    };

    return map[value as UserRoleEnum] ?? value;
}

export const getRoleOptions = () => getEnumOptions(UserRoleEnum, roleLabels);
export const getStatusOptions = () => getEnumOptions(UserStatusEnum, statusLabels);
