import { z } from 'zod';

import { defaultTronWeb } from '@/components/TronProvider';

import { ByteTypes, isNBytesValue } from './bytes';
import { getMaxValue, getMinValue, NumericTypes } from './numberic';
import { isValidAddress } from './tools';

export const DataTypes: Record<TDataType, string> = {
  address: 'address',
  bool: 'bool',
  string: 'string',

  int8: 'int8',
  int16: 'int16',
  int24: 'int24',
  int32: 'int32',
  int64: 'int64',
  int128: 'int128',
  int256: 'int256',

  uint8: 'uint8',
  uint16: 'uint16',
  uint24: 'uint24',
  uint32: 'uint32',
  uint64: 'uint64',
  uint128: 'uint128',
  uint256: 'uint256',

  bytes1: 'bytes1',
  bytes2: 'bytes2',
  bytes3: 'bytes3',
  bytes4: 'bytes4',
  bytes8: 'bytes8',
  bytes16: 'bytes16',
  bytes32: 'bytes32',
  bytes: 'bytes',
};

export const DataTypeOptions = Object.keys(DataTypes).map((key) => ({
  value: key,
  label: DataTypes[key as TDataType],
}));

export const isSupportedType = (type: TDataType) => {
  return DataTypes[type] !== undefined;
};

export const genRuleSchema = () => {
  // 
  const result = {} as Record<TDataType, any>;

  NumericTypes.forEach((type) => {
    result[type] = z
      .string()
      .transform((val) => val.trim())
      .refine(
        (val) => {
          if (val === '') return true;
          const num = parseInt(val, 10);
          if (isNaN(num)) return false;
          const min = getMinValue(type);
          const max = getMaxValue(type);
          return num >= min && num <= max;
        },
        {
          message: 'Must be a valid number between min and max',
        }
      );
  });

  ByteTypes.forEach((type) => {
    result[type] = z
      .string()
      .transform((val) => val.trim())
      .refine((val) => isNBytesValue(type, val), {
        message: 'Must be a valid bytes value',
      });
  });

  result.address = z
    .string()
    .transform((val) => val.trim())
    .refine(
      // 
      (val) => (val === '' ? true : (defaultTronWeb as any).isAddress(val)) || isValidAddress(val),
      {
        message: 'Must be a valid address',
      }
    );

  result.bool = z.boolean().default(true);

  result.string = z.string().transform((val) => val.trim());

  return result;
};

export const DataTypesSchema = genRuleSchema();
