export interface TableColumn {
    columnDef: string;
    header: string;
    type: string;
}

export const userTableConfig: TableColumn[] = [
    { columnDef: 'dni', header: 'NRO. DE CARNET', type: 'text' },
    { columnDef: 'username', header: 'USUARIO', type: 'text' },
    { columnDef: 'firstName', header: 'NOMBRE', type: 'text' },
    { columnDef: 'lastName', header: 'APELLIDO', type: 'text' },
    { columnDef: 'role', header: 'ROL', type: 'text' },
    { columnDef: 'createdAt', header: 'FECHA DE CREACIÓN', type: 'datetime' },
    { columnDef: 'status', header: 'ESTADO', type: 'toggle' },
    { columnDef: 'edit', header: 'EDITAR', type: 'edit' },
];


