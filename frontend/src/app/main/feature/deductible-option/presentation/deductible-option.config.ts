export interface TableColumn {
    columnDef: string;
    header: string;
    type: string;
}

export const deductibleOptionTableConfig: TableColumn[] = [
    { columnDef: 'insurancePlanName', header: 'NOMBRE DEL PLAN', type: 'text' },
    { columnDef: 'deductible1', header: 'DEDUCIBLE 1', type: 'amount' },
    { columnDef: 'deductible2', header: 'DEDUCIBLE 2', type: 'amount' },
    { columnDef: 'currency', header: 'MONEDA', type: 'text' },
    { columnDef: 'isActive', header: 'ACTIVO', type: 'toggle' },
    { columnDef: 'createdAt', header: 'FECHA DE CREACIÓN', type: 'datetime' },
    { columnDef: 'edit', header: 'EDITAR', type: 'edit' },
  ];
