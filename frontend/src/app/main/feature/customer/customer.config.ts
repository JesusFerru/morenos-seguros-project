export interface TableColumn {
    columnDef: string;
    header: string;
    type: string;
}

export const customerTableConfig: TableColumn[] = [
    { columnDef: 'firstName', header: 'NOMBRE', type: 'text' },
    { columnDef: 'lastName', header: 'APELLIDOS', type: 'text' },
    { columnDef: 'nit', header: 'NIT', type: 'text' },
    { columnDef: 'businessName', header: 'EMPRESA', type: 'text' },
    { columnDef: 'documentNumber', header: 'CI', type: 'text' },
    { columnDef: 'employmentStatus', header: 'ESTADO EMPLEADOR', type: 'bool' },
    { columnDef: 'incomeRange', header: 'RANGO DE INGRESOS', type: 'text' },
    { columnDef: 'fundOrigin', header: 'ORIGEN DE FONDOS', type: 'text' },
    { columnDef: 'isActive', header: 'ACTIVO', type: 'toggle' },
    { columnDef: 'createdAt', header: 'FECHA DE CREACIÓN', type: 'datetime' },
    { columnDef: 'edit', header: 'EDITAR', type: 'edit' },
  ];
