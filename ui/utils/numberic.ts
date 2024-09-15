export const NumericRecrords: Record<TNumeric, TNumeric> = {
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
};

export const NumericTypes = Object.keys(NumericRecrords) as TNumeric[];

export const MIN_VAULES_OF_NUMERIC_TYPES: Record<TNumeric, number> = {
  int8: -128,
  int16: -(2 ** 15),
  int24: -(2 ** 23),
  int32: -(2 ** 31),
  int64: -(2 ** 63),
  int128: -(2 ** 127),
  int256: -(2 ** 255),
  uint8: 0,
  uint16: 0,
  uint24: 0,
  uint32: 0,
  uint64: 0,
  uint128: 0,
  uint256: 0,
} as const;

export const MAX_VAULES_OF_NUMERIC_TYPES: Record<TNumeric, number> = {
  int8: 127,
  int16: 2 ** 15 - 1,
  int24: 2 ** 23 - 1,
  int32: 2 ** 31 - 1,
  int64: 2 ** 63 - 1,
  int128: 2 ** 127 - 1,
  int256: 2 ** 255 - 1,
  uint8: 255,
  uint16: 2 ** 16 - 1,
  uint24: 2 ** 24 - 1,
  uint32: 2 ** 32 - 1,
  uint64: 2 ** 64 - 1,
  uint128: 2 ** 128 - 1,
  uint256: 2 ** 256 - 1,
} as const;

export const getMinValue = (type: TNumeric): number => {
  return MIN_VAULES_OF_NUMERIC_TYPES[type as TNumeric];
};

export const getMaxValue = (type: TNumeric): number => {
  return MAX_VAULES_OF_NUMERIC_TYPES[type as TNumeric];
};
