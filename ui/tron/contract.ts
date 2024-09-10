import { TronWebWithExt } from '@/types/tronWeb';
import { checkProvider } from './helper';

export class TonContract {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #contract: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(abi: any, address: TTronAddress) {
    checkProvider('tronWeb', window);
    this.#contract = (window.tronWeb as TronWebWithExt).contract(abi, address);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async send(method: string, args: any[]): Promise<string> {
    return await this.#contract[method](...args).send();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async call(method: string, args: any[]): Promise<any> {
    return await this.#contract[method](...args).call();
  }
}
