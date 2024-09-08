type TSchema = {
  id: number;
  uuid: THexString;
  schema: TDeclareStmts;
  resolverAddresss: THexString;
};

type TPresentableSchema = TSchema & {
  numberOfClaims: number;
};
