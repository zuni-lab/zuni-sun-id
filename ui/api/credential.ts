import { ProjectENV } from '@env';
import { BaseApi } from './api';

type CredentialPayload = {
  issuer: THexString;
  signature: THexString;
  schema_uid: THexString;
  recipient: THexString;
  expiration_time: number;
  revocable: boolean;
  ref_uid: THexString;
  data: THexString;
};

export type CredentialResponse = CredentialPayload & {
  id: THexString;
  uid: THexString;
  created_at: number;
  updated_at: number;
};

export type CredentialsPaginationResponse = {
  total: number;
  items: CredentialResponse[];
};

export class CredentialApi extends BaseApi {
  static async issue(payload: CredentialPayload) {
    return this.post<{
      uid: string;
    }>(`${ProjectENV.NEXT_PUBLIC_API_HOST}/api/credential`, payload);
  }

  static async search(
    payload: { uid: string } | { page: number; limit: number; schema_uid?: string }
  ) {
    return this.post<CredentialResponse | CredentialsPaginationResponse>(
      `${ProjectENV.NEXT_PUBLIC_API_HOST}/api/credential/search`,
      payload
    );
  }
}
