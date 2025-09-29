export interface TableColumn {
    columnDef: string;
    header: string;
    type: string;
}

export const bankTableConfig: TableColumn[] = [
    { columnDef: 'bank', header: 'BANCO', type: 'text' },
    { columnDef: 'accountType', header: 'TIPO DE CUENTA', type: 'text' },
    { columnDef: 'accountNumber', header: 'NÚMERO DE CUENTA', type: 'text' },
    { columnDef: 'currency', header: 'MONEDA', type: 'text' },
    { columnDef: 'holderName', header: 'TITULAR', type: 'text' },
    { columnDef: 'isActive', header: 'ACTIVO', type: 'toggle' },
    { columnDef: 'createdAt', header: 'FECHA DE CREACIÓN', type: 'datetime' },
    { columnDef: 'edit', header: 'EDITAR', type: 'edit' },
];