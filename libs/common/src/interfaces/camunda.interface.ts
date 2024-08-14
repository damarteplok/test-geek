import { JSONDoc } from '@camunda8/sdk/dist/zeebe/lib/interfaces-1.0';
import { MethodList } from '../config';

export interface UserTaskInfo {
  name: string;
  processVariables: string | undefined;
  formId: string | undefined;
}

export interface Filter {
  key: number;
  name: string;
  version: number;
  bpmnProcessId: string;
  processInstanceKey: string;
  processDefinitionKey: string;
  state: string;
  processVersion: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  incident: boolean;
  flowNodeId: string;
  flowNodeName: string;
  decisionId: string;
  decisionDefinitionId: string;
  decisionName: string;
  decisionRequirementsId: string;
  decisionRequirementsName: string;
  decisionRequirementsKey: number;
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
export interface RoutePayloadInterface {
  path: string;
  method: MethodList;
  resource?: string;
  description?: string;
  isDefault?: boolean;
}

export interface DeployCamundaResponse {
  bpmnProcessId: string;
  version: number;
  processDefinitionKey: string;
  resourceName: string;
  tenantId: string;
}

export interface ProcessModel {
  startProcess(extraData?: any): Promise<any>;
  startService(extraData?: any): Promise<any>;
}

export interface SubmittableModel {
  submitTask(extraData?: any): Promise<any>;
  removeTask?(extraData?: any): Promise<any>;
  revertTask?(extraData?: any): Promise<any>;
}
