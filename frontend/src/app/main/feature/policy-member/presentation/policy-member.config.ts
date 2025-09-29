export interface TableColumn {
    columnDef: string;
    header: string;
    type: string;
}

export const policyMemberTableConfig: TableColumn[] = [
    { columnDef: 'clientName', header: 'CLIENTE', type: 'text' },
    { columnDef: 'policyName', header: 'POLIZA', type: 'text' },
    { columnDef: 'isTitular', header: 'ES TITULAR', type: 'toggle' },
    { columnDef: 'memberType', header: 'TIPO DE MIEMBRO', type: 'text' },
    { columnDef: 'status', header: 'ESTADO', type: 'text' },
    { columnDef: 'entryDate', header: 'FECHA DE INGRESO', type: 'datetime' },
    { columnDef: 'isActive', header: 'ACTIVO', type: 'toggle' },
    { columnDef: 'createdAt', header: 'FECHA DE CREACIÓN', type: 'datetime' },
    { columnDef: 'edit', header: 'EDITAR', type: 'edit' },
];