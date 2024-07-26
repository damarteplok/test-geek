import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ZeebeGrpcClient } from '@camunda8/sdk/dist/zeebe';
import { ConfigService } from '@nestjs/config';
import { Camunda8 } from '@camunda8/sdk';

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
    console.log('masuk sini')
    console.log(configService.get<string>('ZEEBE_GRPC_ADDRESS'))
    this.client = new Camunda8({
      ZEEBE_GRPC_ADDRESS: configService.get<string>('ZEEBE_GRPC_ADDRESS'),
      ZEEBE_REST_ADDRESS: configService.get<string>('ZEEBE_REST_ADDRESS'),
      ZEEBE_CLIENT_ID: configService.get<string>('ZEEBE_CLIENT_ID'),
      ZEEBE_CLIENT_SECRET: configService.get<string>(
        'ZEEBE_CLIENT_SECRET',
      ),
      CAMUNDA_AUTH_STRATEGY: configService.get<string>(
        'CAMUNDA_AUTH_STRATEGY',
      ),
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
      CAMUNDA_SECURE_CONNECTION:
        configService.get<boolean>('CAMUNDA_SECURE_CONNECTION') ?? false,
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

  async searchProcessDefinition(): Promise<any> {
    const url = `${this.configService.get<string>('CAMUNDA_OPERATE_BASE_URL')}/v1/process-definitions/search`;
    try {
      const response = await fetch(url, {
        method: 'POST',
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
}
