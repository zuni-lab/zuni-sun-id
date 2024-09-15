import { z } from 'zod';
import { DataTypesSchema } from './rules';

export const getValidationSchema = (definitions: TSchemaDefinitions) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields: Record<string, any> = {};
  definitions.forEach((definition) => {
    fields[definition.fieldName] = DataTypesSchema[definition.fieldType];
  });

  return z.object(fields);
};
