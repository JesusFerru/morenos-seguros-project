export interface TableColumn {
    columnDef: string;
    header: string;
    type: string;
}

export const clientTableConfig: TableColumn[] = [
    { columnDef: 'firstName', header: 'NOMBRE', type: 'text' },
    { columnDef: 'lastName', header: 'APELLIDO', type: 'text' },
    { columnDef: 'email', header: 'EMAIL', type: 'text' },
    { columnDef: 'phoneNumber', header: 'TELÉFONO', type: 'text' },
    { columnDef: 'documentNumber', header: 'DOCUMENTO', type: 'text' },
    { columnDef: 'city', header: 'CIUDAD', type: 'text' },
    { columnDef: 'businessName', header: 'EMPRESA', type: 'text' },
    { columnDef: 'isActive', header: 'ACTIVO', type: 'toggle' },
    { columnDef: 'createdAt', header: 'FECHA DE CREACIÓN', type: 'datetime' },
    { columnDef: 'edit', header: 'EDITAR', type: 'edit' },
];