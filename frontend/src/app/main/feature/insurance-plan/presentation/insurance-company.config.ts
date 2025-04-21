export interface TableColumn {
    columnDef: string;
    header: string;
    type: string;
}

export const insurancePlanTableConfig: TableColumn[] = [
    { columnDef: 'name', header: 'NOMBRE DEL PLAN', type: 'text' },
    { columnDef: 'description', header: 'DESCRIPCIÓN', type: 'text' },
    { columnDef: 'insuranceCompanyName', header: 'COMPAÑÍA ASEGURADORA', type: 'text' },
    { columnDef: 'isActive', header: 'ACTIVO', type: 'toggle' },
    { columnDef: 'createdAt', header: 'FECHA DE CREACIÓN', type: 'datetime' },
    { columnDef: 'edit', header: 'EDITAR', type: 'edit' },
  ];
