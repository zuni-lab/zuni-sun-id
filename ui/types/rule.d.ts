type TRule = TRuleNumeric | TRuleBytes | TRuleAddress | TRuleBool | TRuleString;

type TRuleNumeric =
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

type TRuleBytes =
  | 'bytes1'
  | 'bytes2'
  | 'bytes3'
  | 'bytes4'
  | 'bytes8'
  | 'bytes16'
  | 'bytes32'
  | 'bytes';

type TRuleAddress = 'address';

type TRuleBool = 'bool';

type TRuleString = 'string';

type TDeclareStmt = {
  type: TRuleType;
  token: string;
};

type TDeclareStmts = TDeclareStmt[];
