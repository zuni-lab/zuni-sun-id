import {
  Abi,
  AbiFunction,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from 'abitype';

import { TronWebWithExt } from '@/types/tronWeb';

export class TronContract<TAbi extends Abi> {
  // 
  #contract: any;
  abi: TAbi;

  // 
  private constructor(contract: any, abi: TAbi) {
    this.#contract = contract;
    this.abi = abi;
  }

  static async new<TAbi extends Abi>(
    tronWeb: TronWebWithExt,
    abi: TAbi,
    address: TTronAddress
  ): Promise<TronContract<TAbi>> {
    const contract = await tronWeb.contract(abi, address);
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
      // 
    } catch (error: any) {
      throw new Error(error.message, {
        cause: error,
      });
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
      return [raw] as AbiParametersToPrimitiveTypes<abiFunction['outputs'], 'outputs'>;
      // 
    } catch (error: any) {
      throw new Error(error.message, {
        cause: error,
      });
    }
  }
}
