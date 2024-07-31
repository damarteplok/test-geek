import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ZeebeGrpcClient } from '@camunda8/sdk/dist/zeebe';
import { ConfigService } from '@nestjs/config';
import { Camunda8 } from '@camunda8/sdk';
import {
  CreateProcessInstanceBody,
  SearchProcessDefinitionBody,
  SearchTasksBody,
  TaskVariablesBody,
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

@Injectable()
export class Camunda8Service {
  private readonly client: Camunda8;
  private authToken: string;
  private configHeader: Record<string, string>;

  public getAuthToken() {
    return this.authToken;
  }

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

  async deployBpmn(key: string, file: Buffer): Promise<any> {
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
      throw new InternalServerErrorException(error);
    }
  }

  async createProcessInstance(
    body: Partial<CreateProcessInstanceBody>,
  ): Promise<any> {
    const zeebe: ZeebeGrpcClient = this.client.getZeebeGrpcApiClient();

    try {
      const result = await zeebe.createProcessInstanceWithResult({
        bpmnProcessId: body.bpmnProcessId,
        variables: body.variables,
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
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

      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }

      const data = await response.json();
      this.authToken = data.access_token;
      this.setConfigHeader();
      return { message: this.authToken, statusCode: 200 };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // SERVICE OPERATE

  async searchOperate(
    body: Partial<SearchProcessDefinitionBody>,
    type: string,
  ): Promise<any> {
    const url = `${this.operateUrl(type)}/search`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.configHeader,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchOperateByKey(key: string, type: string): Promise<any> {
    const url = `${this.operateUrl(type)}/${key}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.configHeader,
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchProcessInstanceFlowNodeByKey(key: string): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${OPERATE_PROCESS_INSTANCES_URL}/${key}/statistics`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.configHeader,
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchProcessInstanceSequenceFlowByKey(key: string): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${OPERATE_PROCESS_INSTANCES_URL}/${key}/sequence-flows`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.configHeader,
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteOperateByKey(key: string, type: string): Promise<any> {
    const url = `${this.operateUrl(type)}/${key}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.configHeader,
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
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
      throw new InternalServerErrorException(error);
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
      throw new InternalServerErrorException(error);
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
    let url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${TASKLIST_FORM_URL}/${key}`;

    if (processDefinitionKey) {
      const urlObj = new URL(url);
      urlObj.searchParams.append('processDefinitionKey', processDefinitionKey);
      url = urlObj.toString();
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.configHeader,
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchTasklistTasksByKey(key: string): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${TASKLIST_TASK_URL}/${key}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.configHeader,
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchTasklistVariablesByKey(key: string): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${TASKLIST_VARIABLE_URL}/${key}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.configHeader,
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchTasks(body: Partial<SearchTasksBody>): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${TASKLIST_TASK_URL}/search`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.configHeader,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchTasksVariables(
    key: string,
    body: Partial<TaskVariablesBody>,
  ): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${TASKLIST_TASK_URL}/${key}/variables/search`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.configHeader,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async saveTasksVariables(
    key: string,
    body: Partial<VariablesBody>,
  ): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${TASKLIST_TASK_URL}/${key}/variables`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.configHeader,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async patchTasksAssign(key: string): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${TASKLIST_TASK_URL}/${key}/assign`;
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.configHeader,
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async patchTasksUnassign(key: string): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${TASKLIST_TASK_URL}/${key}/unassign`;
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.configHeader,
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async patchTasksComplete(
    key: string,
    body: Partial<VariablesBody>,
  ): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}${TASKLIST_TASK_URL}/${key}/complete`;
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.configHeader,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new InternalServerErrorException(`Error`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
