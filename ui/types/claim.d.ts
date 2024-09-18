type TClaim = {
  uid: THexString;
  schema: {
    id: number;
    name: string;
  };
  issuer: tron;
  recipient: tron;
  type: string; // TODO: define claim type
  time: number;
};

type TClaims = TClaim[];
