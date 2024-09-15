'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn/Form';
import { Input } from '@/shadcn/Input';

import { HexLink } from '@/components/builders/HexLink';
import { globalTronWeb } from '@/components/TronProvider';
import { APP_NAME, TAPP_NAME } from '@/constants/configs';
import { AppRouter } from '@/constants/router';
import { ToastTemplate } from '@/constants/toast';
import { getValidationSchema } from '@/utils/schema';
import { isValidAddress, isValidBytesWithLength } from '@/utils/tools';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { cx } from 'class-variance-authority';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type TCredentialInput<T extends string = TAPP_NAME> =
  | `${T}_Recipient`
  | `${T}_Expiration`
  | `${T}_RefUID`
  | `${T}_Revocable`;

const CredentialFieldKeys = {
  Recipient: `${APP_NAME}_Recipient`,
  Expiration: `${APP_NAME}_Expiration`,
  RefUID: `${APP_NAME}_RefUID`,
  Revocable: `${APP_NAME}_Revocable`,
};

const baseCredentialSchema = z.object({
  [CredentialFieldKeys.Recipient]: z
    .string()
    .transform((val) => val.trim())
    .refine(
      (val) =>
        val.length === 0
          ? true
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (globalTronWeb as any)?.isAddress(val.replace('0x', '')) || isValidAddress(val),
      {
        message: 'Invalid recipient address',
      }
    ),
  [CredentialFieldKeys.Expiration]: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
  [CredentialFieldKeys.RefUID]: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => (val.length === 0 ? true : isValidBytesWithLength(val, 32))),
  [CredentialFieldKeys.Revocable]: z.boolean(),
});

const baseDefaultValues = {
  [CredentialFieldKeys.Recipient]: '',
  [CredentialFieldKeys.Expiration]: '',
  [CredentialFieldKeys.RefUID]: '',
  [CredentialFieldKeys.Revocable]: true,
};

const generateDynamicDefaultValues = (definitions: TSchemaDefinitions) => {
  let result = { ...baseDefaultValues };
  definitions;

  definitions.forEach((d) => {
    result = {
      ...result,
      [d.fieldName]: d.fieldType === 'bool' ? false : '',
    };
  });

  return result;
};

export const IssueCredentialForm: IComponent<{
  data: SchemaData;
}> = ({ data }) => {
  const { connected } = useWallet();
  // const { open: openTxResult } = useTxResult();

  const [submitting, setSubmitting] = useState(false);

  const dynamicSchema = getValidationSchema(data.definition);

  const combinedSchema = baseCredentialSchema.extend(dynamicSchema.shape);

  const defaultValues = generateDynamicDefaultValues(data.definition);

  const form = useForm({
    resolver: zodResolver(combinedSchema),
    defaultValues,
  });

  const { control, handleSubmit } = form;

  console.log({ data });

  const handlePressSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    if (connected && window.tronWeb) {
      // const contract = await getCredentialContract();

      console.log(values);

      console.log(submitting);

      // try {
      //   const tx = await contract.send({
      //     method: 'register',
      //     args: [
      //       values[SchemaFieldKeys.Name] as string,
      //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //       schemaFields as [string, string, string][] as any,
      //       (values[SchemaFieldKeys.ResolverAddress] as THexString) ||
      //         ('0x0000000000000000000000000000000000000000' as THexString),
      //       values[SchemaFieldKeys.Revocable] as boolean,
      //     ],
      //   });

      //   ToastTemplate.Schema.Submit(tx);
      //   setSubmitting(false);
      //   openTxResult(tx);
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // } catch (error: any) {
      //   console.error(error);
      //   ToastTemplate.Schema.SubmitError();
      //   setSubmitting(false);
      // }
      return;
    }

    ToastTemplate.Schema.SubmitError();
    setSubmitting(false);
  });

  const renderInputField = useCallback(
    ({
      name,
      label,
      placeholder,
      className,
      containerClassName,
      required = true,
      type = 'text',
      description,
    }: {
      name: TCredentialInput;
      placeholder: string;
      label?: string | React.ReactNode;
      type?: 'text';
      className?: string;
      containerClassName?: string;
      required?: boolean;
      description?: string;
    }) => {
      return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className={containerClassName}>
              {label && (
                <FormLabel required={required} className="uppercase">
                  {label}
                </FormLabel>
              )}
              <FormDescription>{description}</FormDescription>
              <FormControl>
                <Input
                  {...field}
                  type={type}
                  placeholder={placeholder}
                  className={cx(className)}
                  value={field.value as string}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    },
    [control]
  );

  return (
    <Form {...form}>
      <h1 className="text-2xl font-semibold my-2 mb-4">Issue credential</h1>
      <h2 className="text-lg my-2 text-gray-300 font-medium">Schema</h2>
      <div className="bg-black border-input px-4 py-3 flex items-center justify-between rounded-lg mb-4">
        <div className="text-gray-300 font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-12">Name:</span>
            <span className="uppercase font-bold text-xl text-white"> {data.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12">UID:</span>
            <HexLink
              content={'#' + data.uid}
              href={`${AppRouter.Schema}/${data.uid}`}
              className="text-lg pl-0"
              isFull
            />
          </div>
        </div>
      </div>

      <form onSubmit={handlePressSubmit} className="space-y-4">
        {renderInputField({
          name: CredentialFieldKeys.Recipient as TCredentialInput,
          label: 'Recipient',
          placeholder: 'The optional recipient address, etc: TEg.. or 0x...',
          required: false,
        })}

        {data.definition.map((field) => {
          if (field.fieldType === 'bool') {
            return <>booool</>;
          }
          return renderInputField({
            name: field.fieldName as TCredentialInput,
            label: (
              <p className="uppercase">
                <span>{field.fieldName}</span>
              </p>
            ),
            placeholder: "Enter field's value",
            required: true,
          });
        })}

        {/* {renderInputField({
          name: SchemaFieldKeys.Description as TSchemaInput<TAPP_NAME>,
          label: 'Description',
          placeholder: 'The description of the vault',
          required: false,
        })} */}

        {/* <div className="space-y-3">
          <FormLabel required>Schema declaration: </FormLabel>
          <div className="space-y-3">
            {fields.map((item, index) => {
              return (
                <div
                  key={item.key}
                  className="flex justify-between p-4 bg-muted-foreground gap-4 rounded-lg">
                  <FormField
                    control={control}
                    name={SchemaDeclareTypeKey(index)}
                    render={({ field }) => (
                      <FormItem className="w-1/5">
                        <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(DataTypes).map((v, index) => (
                              <SelectItem
                                key={index}
                                value={v}
                                className="border-b border-gray-500">
                                {v}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {renderInputField({
                    name: SchemaDeclareTokenKey(index) as TSchemaInput<TAPP_NAME>,
                    placeholder: 'Enter field name',
                    containerClassName: 'grow space-y-0',
                  })}
                  {renderInputField({
                    name: SchemaDeclareDescKey(index) as TSchemaInput<TAPP_NAME>,
                    placeholder: 'Enter field description',
                    containerClassName: 'grow space-y-0',
                  })}
                  <Button
                    disabled={fields.length === 1}
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveField(index)}>
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
            <Button
              type="button"
              variant="secondary"
              size={'sm'}
              onClick={handleAddField}
              className="mt-2 px-4 py-5">
              <PlusIcon className="w-4 h-4 mr-1" />
              Add field
            </Button>
          </div>
          <FormMessage>
            {form.formState.errors?.[SchemaFieldKeys.DeclareStmts]?.root?.message
              ? form.formState.errors?.[SchemaFieldKeys.DeclareStmts]?.root?.message
              : form.formState.errors?.[SchemaFieldKeys.DeclareStmts]?.message || ''}
          </FormMessage>
        </div>
        {renderInputField({
          name: SchemaFieldKeys.ResolverAddress as TSchemaInput<TAPP_NAME>,
          label: 'Resolver address',
          placeholder: 'The address of the resolver, eg: 0x...',
          description:
            'An optional smart contract address that will be executed before the schema is created',
          required: false,
        })}

        <FormField
          control={control}
          name={SchemaFieldKeys.Revocable as TSchemaInput<TAPP_NAME>}
          render={({ field }) => (
            <FormItem className="flex items-center rounded-lg border p-4 w-fit bg-black gap-8">
              <FormLabel>Revocable</FormLabel>
              <div className="flex items-center gap-4 !mt-0">
                <span>No</span>
                <FormControl>
                  <Switch checked={field.value as boolean} onCheckedChange={field.onChange} />
                </FormControl>
                <span>Yes</span>
              </div>
            </FormItem>
          )}
        /> */}
        {/* 
        <div className="flex items-center justify-center !mt-4">
          {!connected && <AccountConnect />}
          {connected && (
            <Button
              type={'submit'}
              className="px-4 bg-orange-600 hover:bg-orange-500"
              size={'lg'}
              disabled={submitting}>
              {submitting ? (
                <Loader className="w-4 h-4 text-background animate-spin" />
              ) : (
                'Issue credential'
              )}
            </Button>
          )}
        </div> */}
      </form>
    </Form>
  );
};
