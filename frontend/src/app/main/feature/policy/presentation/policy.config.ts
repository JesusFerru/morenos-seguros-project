export interface TableColumn {
    columnDef: string;
    header: string;
    type: string;
}

export const policyTableConfig: TableColumn[] = [
  {
    columnDef: 'policyNumber',
    header: 'Número de Póliza',
    type: 'text'
  },
  {
    columnDef: 'previousPolicyNumber',
    header: 'Póliza Anterior',
    type: 'text'
  },
  {
    columnDef: 'titularClientName',
    header: 'Cliente Titular',
    type: 'text'
  },
  {
    columnDef: 'agentName',
    header: 'Agente',
    type: 'text'
  },
  {
    columnDef: 'startDate',
    header: 'Fecha Inicio',
    type: 'date'
  },
  {
    columnDef: 'endDate',
    header: 'Fecha Fin',
    type: 'date'
  },
  {
    columnDef: 'deductibleOptionName',
    header: 'Opción Deducible',
    type: 'text'
  },
  {
    columnDef: 'status',
    header: 'Estado',
    type: 'text'
  },
  {
    columnDef: 'isActive',
    header: 'Activo',
    type: 'toggle'
  },
  {
    columnDef: 'edit',
    header: 'Editar',
    type: 'edit'
  }
];
