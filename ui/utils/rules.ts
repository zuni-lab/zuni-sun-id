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
