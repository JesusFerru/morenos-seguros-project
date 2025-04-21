export interface TableColumn {
    columnDef: string;
    header: string;
    type: string;
}

export const insuranceCompanyTableConfig: TableColumn[] = [
  { columnDef: 'name', header: 'NOMBRE', type: 'text' },
  { columnDef: 'description', header: 'DESCRIPCIÓN', type: 'text' },
  { columnDef: 'createdAt', header: 'FECHA DE CREACIÓN', type: 'datetime' },
  { columnDef: 'isActive', header: 'ESTADO', type: 'toggle' },
  { columnDef: 'edit', header: 'EDITAR', type: 'edit' }
];
