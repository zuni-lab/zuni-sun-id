'use client';

import { Button } from '@/shadcn/Button';
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

import { AccountConnect } from '@/components/account/AccountConnect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/Select';
import { Switch } from '@/components/shadcn/Switch';
import { APP_NAME, TAPP_NAME } from '@/constants/configs';
import { ToastTemplate } from '@/constants/toast';
import { DataTypes } from '@/utils/rules';
import { isValidAddress } from '@/utils/tools';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { cx } from 'class-variance-authority';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

type TSchemaInput<T extends string> =
  | `${T}_Name`
  | `${T}_Description`
  | `${T}_ResolverAddress`
  | `${T}_Revocable`;

const SchemaFieldKeys = {
  Name: `${APP_NAME}_Name`,
  Description: `${APP_NAME}_Description`,
  ResolverAddress: `${APP_NAME}_ResolverAddress`,
  Revocable: `${APP_NAME}_Revocable`,
  DeclareStmts: `${APP_NAME}_DeclareStmts`,
};

const SchemaDeclareTokenKey = (index: number) => `${SchemaFieldKeys.DeclareStmts}.${index}.token`;

const SchemaDeclareTypeKey = (index: number) => `${SchemaFieldKeys.DeclareStmts}.${index}.type`;

const baseFormSchema = z.object({
  [SchemaFieldKeys.Name]: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, 'Name is required'),
  [SchemaFieldKeys.Description]: z.optional(z.string().transform((val) => val.trim())),
  [SchemaFieldKeys.ResolverAddress]: z
    .string()
    .transform((val) => val.trim())
    .refine(
      (val) => (val.trim().length === 0 ? true : isValidAddress(val)),
      'Invalid resolver address'
    ),
  [SchemaFieldKeys.Revocable]: z.boolean(),
  [SchemaFieldKeys.DeclareStmts]: z.array(
    z.object({
      token: z.string({
        message: 'This field is required',
      }),
      type: z.string({
        message: 'This field is required',
      }),
    })
  ),
});

export const CreateSchemaForm: IComponent = () => {
  const { address } = useWallet();
  const isConnected = !!address;

  const form = useForm({
    resolver: zodResolver(baseFormSchema),
    defaultValues: {
      [SchemaFieldKeys.Name]: '',
      [SchemaFieldKeys.Description]: '',
      [SchemaFieldKeys.ResolverAddress]: '',
      [SchemaFieldKeys.Revocable]: false,
      [SchemaFieldKeys.DeclareStmts]: Array.from({ length: 2 }).map(() => ({
        token: '',
        type: '',
      })),
    },
  });

  const { control, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: SchemaFieldKeys.DeclareStmts as never,
    keyName: 'key',
  });

  const handleAddField = useCallback(() => {
    append({ token: '', type: '' });
  }, [append]);

  const handleRemoveField = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  const handlePressSubmit = handleSubmit((values) => {
    const declareStmts = values[SchemaFieldKeys.DeclareStmts] as { token: string; type: string }[];

    if (declareStmts.length === 0) {
      form.setError(SchemaFieldKeys.DeclareStmts, {
        message: 'At least one schema declaration is required',
      });
    }

    declareStmts.forEach(({ token, type }, index) => {
      if (!token) {
        form.setError(SchemaDeclareTokenKey(index), {
          message: "Field name can't be empty",
        });
        return;
      }

      if (!type) {
        form.setError(SchemaDeclareTypeKey(index), {
          message: "Field type can't be empty",
        });
        return;
      }
    });

    ToastTemplate.Schema.Submit();
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
      name: TSchemaInput<TAPP_NAME>;
      placeholder: string;
      label?: string;
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
              {label && <FormLabel required={required}>{label}</FormLabel>}
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
      <h1 className="text-2xl font-semibold my-2 mb-4">Create a schema</h1>
      <form onSubmit={handlePressSubmit} className="space-y-4">
        {renderInputField({
          name: SchemaFieldKeys.Name as TSchemaInput<TAPP_NAME>,
          label: 'Name',
          placeholder: 'The name of the schema',
        })}

        {renderInputField({
          name: SchemaFieldKeys.Description as TSchemaInput<TAPP_NAME>,
          label: 'Description',
          placeholder: 'The description of the vault',
          required: false,
        })}

        <div className="space-y-3">
          <FormLabel required>Schema declaration: </FormLabel>
          <div className="space-y-3">
            {fields.map((item, index) => {
              return (
                <div
                  key={item.key}
                  className="flex justify-between p-4 bg-muted-foreground gap-4 rounded-lg">
                  {renderInputField({
                    name: SchemaDeclareTokenKey(index) as TSchemaInput<TAPP_NAME>,
                    placeholder: 'Enter field name',
                    containerClassName: 'grow space-y-0',
                  })}
                  <FormField
                    control={control}
                    name={SchemaDeclareTypeKey(index)}
                    render={({ field }) => (
                      <FormItem className="w-1/3">
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
        />
        <div className="flex items-center justify-center !mt-4">
          {!isConnected && <AccountConnect />}
          {isConnected && (
            <Button
              type="submit"
              className="px-4 bg-orange-600 hover:bg-orange-500"
              size={'lg'}
              //    disabled={isPending || isConfirming}
            >
              {/* {isPending || isConfirming ? (
                <Loader className="w-4 h-4 text-background animate-spin" />
              ) : (
                
              )} */}
              Create schema
            </Button>
          )}
        </div>
        {/* {writeCallError && (
          <div className="text-destructive text-sm">
            Error: {(writeCallError as BaseError).shortMessage || writeCallError.message}
          </div>
        )}
        {<TxDialog hash={hashState as string} onClose={() => setHash('')} />} */}
        {/* {isConfirming && <div>Waiting for confirmation...</div>} */}
        {/* {isConfirmed && <div>Transaction confirmed.</div>} */}
      </form>
    </Form>
  );
};
