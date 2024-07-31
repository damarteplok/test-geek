import { JSONDoc } from '@camunda8/sdk/dist/zeebe/lib/interfaces-1.0';

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

export interface FromToDate {
  from: Date;
  to: Date;
}

export interface TaskVariables {
  name: string;
  value: string;
  operator: string;
}

export interface SearchTasksBody {
  state: string;
  assigned: boolean;
  assignees: string[];
  taskDefinitionId: string;
  candidateGroup: string;
  candidateGroups: string[];
  candidateUser: string;
  candidateUsers: string[];
  processDefinitionKey: string;
  processInstanceKey: string;
  pageSize: number;
  tenantIds: string[];
  searchAfter: string[];
  searchAfterOrEqual: string[];
  searchBefore: string[];
  searchBeforeOrEqual: string[];
  implementation: string;
  followUpDate: FromToDate;
  dueDate: FromToDate;
  taskVariables: TaskVariables[];
}

export interface IncludeVariable {
  name: string;
  alwaysReturnFullValue: boolean;
}
export interface TaskVariablesBody {
  variableNames: string[];
  includeVariable: IncludeVariable[];
}

export interface DraftVariables {
  name: string;
  value: string;
}

export interface VariablesBody {
  variables: DraftVariables[];
}

export interface CreateProcessInstanceBody {
  bpmnProcessId: string;
  variables?: JSONDoc;
}
