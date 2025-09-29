export interface TableColumn {
    columnDef: string;
    header: string;
    type: string;
}

export const paymentTableConfig: TableColumn[] = [
    { columnDef: 'policyNumber', header: 'NÚMERO DE PÓLIZA', type: 'text' },
    { columnDef: 'paymentDate', header: 'FECHA DE PAGO', type: 'datetime' },
    { columnDef: 'period', header: 'PERÍODO', type: 'text' },
    { columnDef: 'paymentMethod', header: 'MÉTODO DE PAGO', type: 'text' },
    { columnDef: 'amount', header: 'MONTO', type: 'currency' },
    { columnDef: 'receiptUrl', header: 'RECIBO', type: 'link' },
    { columnDef: 'isActive', header: 'ACTIVO', type: 'toggle' },
    { columnDef: 'createdAt', header: 'FECHA DE CREACIÓN', type: 'datetime' },
    { columnDef: 'edit', header: 'EDITAR', type: 'edit' },
];