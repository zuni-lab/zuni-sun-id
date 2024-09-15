type TClaim = {
  uid: THexString;
  schema: {
    id: number;
    name: string;
  };
  issuer: THexString;
  recipient: THexString;
  type: string; // TODO: define claim type
  time: number;
};

type TClaims = TClaim[];
