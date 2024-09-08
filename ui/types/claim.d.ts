type TClaim = {
  uuid: THexString;
  schemaId: number;
  from: THexString;
  to: THexString;
  type: string; // TODO: define claim type
  time: number;
};

type TClaims = TClaim[];
