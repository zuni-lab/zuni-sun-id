export const checkProvider = (key: string, document: Window) => {
  if (typeof document == 'undefined' || !document[key as keyof Window]) {
    console.log({ key, document });
    throw new Error(`${key} is not found in the document`);
  }
};
