export interface TableColumn {
    columnDef: string;
    header: string;
    type: string;
}

export const insuranceCompanyTableConfig: TableColumn[] = [
  { columnDef: 'name', header: 'NOMBRE', type: 'text' },
  { columnDef: 'nit', header: 'NIT', type: 'text' },
  { columnDef: 'email', header: 'EMAIL', type: 'text' },
  { columnDef: 'phone', header: 'TELÉFONO', type: 'text' },
  { columnDef: 'address', header: 'DIRECCIÓN', type: 'text' },
  { columnDef: 'createdAt', header: 'FECHA DE CREACIÓN', type: 'datetime' },
  { columnDef: 'isActive', header: 'ESTADO', type: 'status' },
  { columnDef: 'edit', header: 'EDITAR', type: 'edit' }
];
