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
import { globalTronWeb } from '@/components/TronProvider';
import { SCHEMA_REGISTRY_ABI } from '@/constants/abi';
import { APP_NAME, TAPP_NAME } from '@/constants/configs';
import { ToastTemplate } from '@/constants/toast';
import { useTxResult } from '@/states/useTxResult';
import { TronContract } from '@/tron/contract';
import { DataTypes } from '@/utils/rules';
import { isValidAddress } from '@/utils/tools';
import { ProjectENV } from '@env';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { cx } from 'class-variance-authority';
import { Loader, PlusIcon, TrashIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
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

const SchemaDeclareDescKey = (index: number) => `${SchemaFieldKeys.DeclareStmts}.${index}.desc`;

const baseFormSchema = z.object({
  [SchemaFieldKeys.Name]: z.string().optional(),
  // [SchemaFieldKeys.Description]: z.optional(z.string().transform((val) => val.trim())),
  [SchemaFieldKeys.ResolverAddress]: z
    .string()
    .transform((val) => val.trim())
    .refine(
      (val) =>
        val.trim().length === 0
          ? true
          : globalTronWeb
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (globalTronWeb as any).isAddress(val.replace('0x', ''))
            : isValidAddress(val),
      'Invalid resolver address'
    ),
  [SchemaFieldKeys.Revocable]: z.boolean(),
  [SchemaFieldKeys.DeclareStmts]: z
    .array(
      z.object({
        type: z
          .string({
            message: 'The field type is required',
          })
          .refine((val) => val.trim().length > 0, {
            message: 'This field is required',
          }),
        token: z
          .string({
            message: 'This field is required',
          })
          .refine((val) => val.trim().length > 0, {
            message: 'Please enter the field name',
          }),
        desc: z.string().optional(),
      })
    )
    .nonempty({ message: 'At least one schema declaration is required' }),
});

export const CreateSchemaForm: IComponent = () => {
  const { address, connected } = useWallet();
  const isConnected = !!address;

  const [submitting, setSubmitting] = useState(false);
  const { open: openTxResult } = useTxResult();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(baseFormSchema),
    defaultValues: {
      [SchemaFieldKeys.Name]: '',
      // [SchemaFieldKeys.Description]: '',
      [SchemaFieldKeys.ResolverAddress]: '',
      [SchemaFieldKeys.Revocable]: false,
      [SchemaFieldKeys.DeclareStmts]: Array.from({ length: 2 }).map(() => ({
        token: '',
        type: '',
        desc: '',
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

  const handlePressSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    if (connected && window.tronWeb) {
      const contract = await TronContract.new(
        SCHEMA_REGISTRY_ABI,
        ProjectENV.NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS as TTronAddress
      );

      const schemaFields = (
        values[SchemaFieldKeys.DeclareStmts] as {
          token: string;
          type: string;
          desc: string;
        }[]
      ).map((item) => {
        return {
          fieldType: item.type,
          fieldName: item.token,
          fieldDescription: item.desc,
        };
      });

      // .map((item) => [item.type, item.token, item.desc]);

      try {
        const tx = await contract.send({
          method: 'register',
          args: [
            schemaFields,
            values[SchemaFieldKeys.ResolverAddress] as THexString,
            values[SchemaFieldKeys.Revocable] as boolean,
          ],
        });

        ToastTemplate.Schema.Submit(tx);
        setSubmitting(false);
        queryClient.invalidateQueries({
          queryKey: ['schemas'],
        });
        openTxResult(tx);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error);
        ToastTemplate.Schema.SubmitError();
        setSubmitting(false);
      }
    }
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
          required: false,
        })}

        {/* {renderInputField({
          name: SchemaFieldKeys.Description as TSchemaInput<TAPP_NAME>,
          label: 'Description',
          placeholder: 'The description of the vault',
          required: false,
        })} */}

        <div className="space-y-3">
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
        />
        <div className="flex items-center justify-center !mt-4">
          {!isConnected && <AccountConnect />}
          {isConnected && (
            <Button
              type={'submit'}
              className="px-4 bg-orange-600 hover:bg-orange-500"
              size={'lg'}
              disabled={submitting}>
              {submitting ? (
                <Loader className="w-4 h-4 text-background animate-spin" />
              ) : (
                'Create schema'
              )}
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
