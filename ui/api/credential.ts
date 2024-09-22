import { ProjectENV } from '@env';
import { BaseApi } from './api';

type CredentialPayload = {
  issuer: string;
  signature: string;
  schema_uid: string;
  recipient: string;
  expiration_time: number;
  revocable: boolean;
  ref_uid: string;
  data: string;
};

type CredentialReponse = CredentialPayload & {
  id: string;
  uid: string;
  created_at: number;
  updated_at: number;
};

export class CredentialApi extends BaseApi {
  static async issue(payload: CredentialPayload) {
    return this.post<{
      uid: string;
    }>(`${ProjectENV.NEXT_PUBLIC_API_HOST}/api/credential`, payload);
  }

  static async search(payload: { uid: string }) {
    return this.post<CredentialReponse>(
      `${ProjectENV.NEXT_PUBLIC_API_HOST}/api/credential/search`,
      payload
    );
  }
}
