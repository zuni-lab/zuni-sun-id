import { TronWebWithExt } from '@/types/tronWeb';
import {
  Abi,
  AbiFunction,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from 'abitype';
import { checkProvider } from './helper';

export class TronContract<TAbi extends Abi> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #contract: any;
  abi: TAbi;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private constructor(contract: any, abi: TAbi) {
    this.#contract = contract;
    this.abi = abi;
  }

  static async new<TAbi extends Abi>(
    abi: TAbi,
    address: TTronAddress
  ): Promise<TronContract<TAbi>> {
    checkProvider('tronWeb', window);
    const contract = await (window.tronWeb as TronWebWithExt).contract(abi, address);
    return new TronContract(contract, abi);
  }

  public async send<
    functionName extends ExtractAbiFunctionNames<TAbi, 'nonpayable' | 'payable'>,
    abiFunction extends AbiFunction = ExtractAbiFunction<TAbi, functionName>,
  >(config: {
    method: functionName;
    args: AbiParametersToPrimitiveTypes<abiFunction['inputs'], 'inputs'>;
  }): Promise<string> {
    try {
      return await this.#contract[config.method](...config.args).send();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  public async call<
    functionName extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
    abiFunction extends AbiFunction = ExtractAbiFunction<TAbi, functionName>,
  >(config: {
    method: functionName;
    args: AbiParametersToPrimitiveTypes<abiFunction['inputs'], 'inputs'>;
  }): Promise<AbiParametersToPrimitiveTypes<abiFunction['outputs'], 'outputs'>> {
    try {
      const raw = await this.#contract[config.method](...config.args).call();
      return raw as AbiParametersToPrimitiveTypes<abiFunction['outputs'], 'outputs'>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}
