export interface TableColumn {
    columnDef: string;
    header: string;
    type: string;
}

export const policyTableConfig: TableColumn[] = [
  {
    columnDef: 'policyNumber',
    header: 'NRO. DE PÓLIZA',
    type: 'text'
  },
  {
    columnDef: 'previousPolicyNumber',
    header: 'PÓLIZA ANTERIOR',
    type: 'text'
  },
  {
    columnDef: 'titularClientName',
    header: 'CLIENTE TITULAR',
    type: 'text'
  },
  {
    columnDef: 'agentName',
    header: 'AGENTE',
    type: 'text'
  },
  {
    columnDef: 'startDate',
    header: 'FECHA INICIO',
    type: 'date'
  },
  {
    columnDef: 'endDate',
    header: 'FECHA FIN',
    type: 'date'
  },
  {
    columnDef: 'deductible1',
    header: 'MONTO DEDUCIBLE 1',
    type: 'amount'
  },
  {
    columnDef: 'status',
    header: 'ESTADO',
    type: 'text'
  },
  {
    columnDef: 'isActive',
    header: 'ACTIVO',
    type: 'toggle'
  },
  {
    columnDef: 'edit',
    header: 'EDITAR',
    type: 'edit'
  }
];
