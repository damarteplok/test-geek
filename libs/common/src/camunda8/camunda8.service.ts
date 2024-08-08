import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ZeebeGrpcClient } from '@camunda8/sdk/dist/zeebe';
import { ConfigService } from '@nestjs/config';
import { Camunda8 } from '@camunda8/sdk';
import {
  CreateProcessInstanceBody,
  DeployCamundaResponse,
  SearchProcessDefinitionBody,
  SearchTasksBody,
  TaskVariablesBody,
  UserTaskInfo,
  VariablesBody,
} from '../interfaces';
import {
  OPERATE_PROCESS_DEFINITION_URL,
  OPERATE_DECISION_DEFINITION_URL,
  OPERATE_DECISION_INSTANCE_URL,
  OPERATE_DECISION_REQUIREMENT_URL,
  OPERATE_FLOWNODE_INSTANCE_URL,
  OPERATE_INCIDENT_URL,
  OPERATE_PROCESS_INSTANCES_URL,
  OPERATE_VARIABLES_URL,
  TASKLIST_FORM_URL,
  TASKLIST_TASK_URL,
  TASKLIST_VARIABLE_URL,
} from '../constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class Camunda8Service {
  private readonly client: Camunda8;
  private authToken: string;
  private refreshToken: string;
  private configHeader: Record<string, string>;

  public setConfigHeader() {
    this.configHeader = {
      'Content-Type': 'application/json',
      Accept: '*/*',
      Authorization: `Bearer ${this.authToken}`,
    };
  }

  public getConfigHeader() {
    return this.configHeader;
  }

  constructor(private readonly configService: ConfigService) {
    this.client = new Camunda8({
      ZEEBE_GRPC_ADDRESS: configService.get<string>('ZEEBE_GRPC_ADDRESS'),
      ZEEBE_REST_ADDRESS: configService.get<string>('ZEEBE_REST_ADDRESS'),
      ZEEBE_CLIENT_ID: configService.get<string>('ZEEBE_CLIENT_ID'),
      ZEEBE_CLIENT_SECRET: configService.get<string>('ZEEBE_CLIENT_SECRET'),
      CAMUNDA_AUTH_STRATEGY: configService.get<string>('CAMUNDA_AUTH_STRATEGY'),
      CAMUNDA_OAUTH_URL: configService.get<string>('CAMUNDA_OAUTH_URL'),
      CAMUNDA_TASKLIST_BASE_URL: configService.get<string>(
        'CAMUNDA_TASKLIST_BASE_URL',
      ),
      CAMUNDA_OPERATE_BASE_URL: configService.get<string>(
        'CAMUNDA_OPERATE_BASE_URL',
      ),
      CAMUNDA_OPTIMIZE_BASE_URL: configService.get<string>(
        'CAMUNDA_OPTIMIZE_BASE_URL',
      ),
      CAMUNDA_MODELER_BASE_URL: configService.get<string>(
        'CAMUNDA_MODELER_BASE_URL',
      ),
      CAMUNDA_TENANT_ID: configService.get<string>('CAMUNDA_TENANT_ID'),
      CAMUNDA_SECURE_CONNECTION: false,
    });
  }

  async deployBpmn(key: string, file: Buffer): Promise<DeployCamundaResponse> {
    const zeebe: ZeebeGrpcClient = this.client.getZeebeGrpcApiClient();

    try {
      const deploy = await zeebe.deployResource({
        name: key,
        process: file,
      });
      if (deploy.deployments && deploy.deployments.length > 0) {
        return deploy.deployments[0].process;
      } else {
        throw new InternalServerErrorException(
          'Deployment failed: No deployments found in the response',
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deployForm(key: string, file: Buffer): Promise<any> {
    const zeebe: ZeebeGrpcClient = this.client.getZeebeGrpcApiClient();

    try {
      const deploy = await zeebe.deployResource({
        name: key,
        form: file,
      });
      if (deploy.deployments && deploy.deployments.length > 0) {
        return deploy.deployments[0].form;
      } else {
        throw new InternalServerErrorException(
          'Deployment failed: No deployments found in the response',
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createProcessInstance(
    body: Partial<CreateProcessInstanceBody>,
  ): Promise<any> {
    const zeebe: ZeebeGrpcClient = this.client.getZeebeGrpcApiClient();

    try {
      const result = await zeebe.createProcessInstance({
        bpmnProcessId: body.bpmnProcessId,
        variables: body.variables,
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async cancelProcessInstance(key: string): Promise<any> {
    const zeebe: ZeebeGrpcClient = this.client.getZeebeGrpcApiClient();

    try {
      const result = await zeebe.cancelProcessInstance(key);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(): Promise<any> {
    const formData = new URLSearchParams();
    formData.append(
      'client_id',
      this.configService.get<string>('ZEEBE_CLIENT_ID'),
    );
    formData.append(
      'client_secret',
      this.configService.get<string>('ZEEBE_CLIENT_SECRET'),
    );
    formData.append('grant_type', 'client_credentials');

    try {
      const response = await fetch(
        this.configService.get<string>('CAMUNDA_OAUTH_URL'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        },
      );
      const data = await response.json();
      this.authToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.setConfigHeader();
      await this.getAuthToken();
      return { message: this.authToken, statusCode: 200 };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async refreshTokenFunc(): Promise<void> {
    const formData = new URLSearchParams();
    formData.append(
      'client_id',
      this.configService.get<string>('ZEEBE_CLIENT_ID'),
    );
    formData.append(
      'client_secret',
      this.configService.get<string>('ZEEBE_CLIENT_SECRET'),
    );
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', this.refreshToken);
    try {
      const response = await fetch(
        this.configService.get<string>('CAMUNDA_OAUTH_URL'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        },
      );
      const data = await response.json();
      this.authToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.setConfigHeader();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAuthToken(): Promise<string> {
    if (this.isTokenExpired(this.authToken)) {
      await this.refreshTokenFunc();
    }
    return this.authToken;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken = jwt.decode(token) as { exp?: number } | null;
      return (decodedToken?.exp ?? 0) * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }

  // SERVICE OPERATE

  async searchOperate(
    body: Partial<SearchProcessDefinitionBody>,
    type: string,
  ): Promise<any> {
    const url = `${this.operateUrl(type)}/search`;
    try {
      const token = await this.getAuthToken();
      const response = await fetch(url, {
        method: 'POST',
        headers: { ...this.configHeader, Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async searchOperateByKey(key: string, type: string): Promise<any> {
    const url = `${this.operateUrl(type)}/${key}`;
    try {
      const token = await this.getAuthToken();
      const response = await fetch(url, {
        method: 'GET',
        headers: { ...this.configHeader, Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async searchProcessInstanceFlowNodeByKey(key: string): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${OPERATE_PROCESS_INSTANCES_URL}/${key}/statistics`;
    try {
      const token = await this.getAuthToken();
      const response = await fetch(url, {
        method: 'GET',
        headers: { ...this.configHeader, Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async searchProcessInstanceSequenceFlowByKey(key: string): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${OPERATE_PROCESS_INSTANCES_URL}/${key}/sequence-flows`;
    try {
      const token = await this.getAuthToken();
      const response = await fetch(url, {
        method: 'GET',
        headers: { ...this.configHeader, Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteOperateByKey(key: string, type: string): Promise<any> {
    const url = `${this.operateUrl(type)}/${key}`;
    try {
      const token = await this.getAuthToken();
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { ...this.configHeader, Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async searchProcessDefinitonByKeyAsXml(key: string): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${OPERATE_PROCESS_DEFINITION_URL}/${key}/xml`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/xml',
          Accept: '*/*',
          Authorization: `Bearer ${this.authToken}`,
        },
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.text();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async searchProcessDecisionByKeyAsXml(key: string): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${OPERATE_DECISION_REQUIREMENT_URL}/${key}/xml`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/xml',
          Accept: '*/*',
          Authorization: `Bearer ${this.authToken}`,
        },
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.text();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private operateUrl(type: string): string {
    switch (type) {
      case 'process-definition':
        return `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${OPERATE_PROCESS_DEFINITION_URL}`;

      case 'decision-definition':
        return `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${OPERATE_DECISION_DEFINITION_URL}`;

      case 'decision-instance':
        return `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${OPERATE_DECISION_INSTANCE_URL}`;

      case 'flownode-instance':
        return `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${OPERATE_FLOWNODE_INSTANCE_URL}`;

      case 'variables':
        return `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${OPERATE_VARIABLES_URL}`;

      case 'process-instance':
        return `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${OPERATE_PROCESS_INSTANCES_URL}`;

      case 'drd':
        return `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${OPERATE_DECISION_REQUIREMENT_URL}`;

      case 'incidents':
        return `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${OPERATE_INCIDENT_URL}`;

      default:
        return `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${OPERATE_PROCESS_DEFINITION_URL}`;
    }
  }

  isValidType(type: string): boolean {
    const arrTypes = [
      'process-definition',
      'decision-definition',
      'decision-instance',
      'flownode-instance',
      'variables',
      'process-instance',
      'drd',
      'incidents',
    ];
    return arrTypes.includes(type);
  }

  // SERVICE TASKLIST

  async searchTasklistFormsByKey(
    key: string,
    processDefinitionKey?: string,
  ): Promise<any> {
    let url = `${this.configService.get<string>('CAMUNDA_TASKLIST_BASE_URL')}${TASKLIST_FORM_URL}/${key}`;

    if (processDefinitionKey) {
      const urlObj = new URL(url);
      urlObj.searchParams.append('processDefinitionKey', processDefinitionKey);
      url = urlObj.toString();
    }

    try {
      const token = await this.getAuthToken();
      const response = await fetch(url, {
        method: 'GET',
        headers: { ...this.configHeader, Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async searchTasklistTasksByKey(key: string): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_TASKLIST_BASE_URL')}${TASKLIST_TASK_URL}/${key}`;

    try {
      const token = await this.getAuthToken();
      const response = await fetch(url, {
        method: 'GET',
        headers: { ...this.configHeader, Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async searchTasklistVariablesByKey(key: string): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_TASKLIST_BASE_URL')}${TASKLIST_VARIABLE_URL}/${key}`;

    try {
      const token = await this.getAuthToken();
      const response = await fetch(url, {
        method: 'GET',
        headers: { ...this.configHeader, Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async searchTasks(body: Partial<SearchTasksBody>): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_TASKLIST_BASE_URL')}${TASKLIST_TASK_URL}/search`;
    try {
      const token = await this.getAuthToken();
      const response = await fetch(url, {
        method: 'POST',
        headers: { ...this.configHeader, Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async searchTasksVariables(
    key: string,
    body: Partial<TaskVariablesBody>,
  ): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_TASKLIST_BASE_URL')}${TASKLIST_TASK_URL}/${key}/variables/search`;
    try {
      const token = await this.getAuthToken();
      const response = await fetch(url, {
        method: 'POST',
        headers: { ...this.configHeader, Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async saveTasksVariables(
    key: string,
    body: Partial<VariablesBody>,
  ): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_TASKLIST_BASE_URL')}${TASKLIST_TASK_URL}/${key}/variables`;
    try {
      const token = await this.getAuthToken();
      const response = await fetch(url, {
        method: 'POST',
        headers: { ...this.configHeader, Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async patchTasksAssign(key: string): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_TASKLIST_BASE_URL')}${TASKLIST_TASK_URL}/${key}/assign`;
    try {
      const token = await this.getAuthToken();
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { ...this.configHeader, Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          assignee: 'demo',
        }),
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async patchTasksUnassign(key: string): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_TASKLIST_BASE_URL')}${TASKLIST_TASK_URL}/${key}/unassign`;
    try {
      const token = await this.getAuthToken();
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { ...this.configHeader, Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async patchTasksComplete(
    key: string,
    body: Partial<VariablesBody>,
  ): Promise<any> {
    body.variables.map((el) => {
      el.value = JSON.stringify(el.value);
    });
    const url = `${this.configService.get<string>('CAMUNDA_TASKLIST_BASE_URL')}${TASKLIST_TASK_URL}/${key}/complete`;
    try {
      const token = await this.getAuthToken();
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { ...this.configHeader, Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // service get elements

  getProcessId(bpmnData: any): string {
    const processElement = bpmnData.rootElement.rootElements.find(
      (element) => element.$type === 'bpmn:Process',
    );
    return processElement ? processElement.id : null;
  }

  getServiceTaskIds(bpmnData: any): string[] {
    const processElement = bpmnData.rootElement.rootElements.find(
      (element) => element.$type === 'bpmn:Process',
    );

    if (!processElement) {
      return [];
    }

    const arrService = processElement.flowElements.filter(
      (element) => element.$type === 'bpmn:ServiceTask',
    );
    let arrServiceName = [];
    arrService.forEach((serviceTask) => {
      if (
        serviceTask.extensionElements &&
        serviceTask.extensionElements.$type === 'bpmn:ExtensionElements'
      ) {
        serviceTask.extensionElements.values.forEach((el) => {
          arrServiceName.push(el.type);
        });
      }
    });
    return arrServiceName;
  }

  getUserTaskIds(bpmnData: any): UserTaskInfo[] {
    const processElement = bpmnData.rootElement.rootElements.find(
      (element) => element.$type === 'bpmn:Process',
    );

    if (!processElement) {
      return [];
    }

    return processElement.flowElements
      .filter((element) => element.$type === 'bpmn:UserTask')
      .map((userTask) => {
        if (userTask.documentation?.length) {
          return {
            name: userTask.id,
            processVariables: userTask.documentation[0].text?.toString(),
          };
        } else {
          return {
            name: userTask.id,
            processVariables: null,
          };
        }
      });
  }
}
