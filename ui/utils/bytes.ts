import { isValidBytesWithLength } from './tools';

export const ByteRecords: Record<TBytes, TBytes> = {
  bytes1: 'bytes1',
  bytes2: 'bytes2',
  bytes3: 'bytes3',
  bytes4: 'bytes4',
  bytes8: 'bytes8',
  bytes16: 'bytes16',
  bytes32: 'bytes32',
  bytes: 'bytes',
};

export const ByteTypes = Object.keys(ByteRecords) as TBytes[];

export const isNBytesValue = (type: TBytes, val: string): boolean => {
  let num = 0;
  switch (type) {
    case 'bytes1':
      num = 1;
      break;
    case 'bytes2':
      num = 2;
      break;
    case 'bytes3':
      num = 3;
      break;
    case 'bytes4':
      num = 4;
      break;
    case 'bytes8':
      num = 8;
      break;
    case 'bytes16':
      num = 16;
      break;
    case 'bytes32':
      num = 32;
      break;
    default:
      break;
  }
  return isValidBytesWithLength(val, num);
};
