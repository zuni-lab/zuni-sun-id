import { ProjectENV } from '@env';
import { BaseApi } from './api';

type CredentialPayload = {
  issuer: string;
  signature: THexString;
  schema_uid: THexString;
  recipient: string;
  expiration_time: number;
  revocable: boolean;
  ref_uid: THexString;
  data: THexString;
};

type CredentialReponse = CredentialPayload & {
  id: THexString;
  uid: THexString;
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
