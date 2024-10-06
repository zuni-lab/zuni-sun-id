import { z } from 'zod';

import { DataTypesSchema } from './rules';

export const getValidationSchema = (definitions: TSchemaDefinitions) => {
  // 
  const fields: Record<string, any> = {};
  definitions.forEach((definition) => {
    fields[definition.fieldName] = DataTypesSchema[definition.fieldType];
  });

  return z.object(fields);
};
