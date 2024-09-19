import { ProjectENV } from '@env';
import { BaseApi } from './api';

export class CredentialApi extends BaseApi {
  static async issue(payload: {
    issuer: string;
    signature: string;
    schema_uid: string;
    recipient: string;
    expiration_time: number;
    revocable: boolean;
    ref_uid: string;
    data: string;
  }) {
    return this.post<{
      uid: string;
    }>(`${ProjectENV.NEXT_PUBLIC_API_HOST}/api/credential`, payload);
  }
}
