export interface Filter {
  key: number;
  name: string;
  version: number;
  bpmnProcessId: string;
  tenantId: string;
}

export interface Sort {
  field: string;
  order: 'ASC' | 'DESC';
}

export interface SearchProcessDefinitionBody {
  filter: Filter;
  size: number;
  searchAfter: object[];
  sort: Sort[];
}
