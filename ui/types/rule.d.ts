type TDataType = TNumeric | TBytes | TAddress | TBool | TString;

type TNumeric =
  | 'int8'
  | 'int16'
  | 'int24'
  | 'int32'
  | 'int64'
  | 'int128'
  | 'int256'
  | 'uint8'
  | 'uint16'
  | 'uint24'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256';

type TBytes =
  | 'bytes1'
  | 'bytes2'
  | 'bytes3'
  | 'bytes4'
  | 'bytes8'
  | 'bytes16'
  | 'bytes32'
  | 'bytes';

type TAddress = 'address';

type TBool = 'bool';

type TString = 'string';

type TDeclareStmt = {
  type: TDataType;
  token: string;
};

type TDeclareStmts = TDeclareStmt[];
