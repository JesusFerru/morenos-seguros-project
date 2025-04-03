export interface TableColumn {
    columnDef: string;
    header: string;
    type: string;
}

export const userTableConfig: TableColumn[] = [
    { columnDef: 'dni', header: 'NRO. DE CARNET', type: 'text' },
    { columnDef: 'username', header: 'USUARIO', type: 'text' },
    { columnDef: 'fullName', header: 'NOMBRE COMPLETO', type: 'text' },
    { columnDef: 'role', header: 'ROL', type: 'text' },
    { columnDef: 'createdAt', header: 'FECHA DE CREACIÓN', type: 'datetime' },
    { columnDef: 'status', header: 'ESTADO', type: 'text' },
    { columnDef: 'edit', header: 'EDITAR', type: 'edit' },
];
