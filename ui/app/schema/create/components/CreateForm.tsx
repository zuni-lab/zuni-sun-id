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
import { TabSwitch } from '@/components/builders/TabSwitch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/Select';
import { defaultTronWeb, useTron } from '@/components/TronProvider';
import { APP_NAME, TAPP_NAME } from '@/constants/configs';
import { ToastTemplate } from '@/constants/toast';
import { useTxResult } from '@/states/useTxResult';
import { DataTypes } from '@/utils/rules';
import { isValidAddress } from '@/utils/tools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, PlusIcon, TrashIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSchemaContract } from '@/hooks/useContract';
import { cx } from 'class-variance-authority';

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
  [SchemaFieldKeys.Name]: z.string().optional(),
  [SchemaFieldKeys.ResolverAddress]: z
    .string()
    .default('0x0000000000000000000000000000000000000000')
    .transform((val) => val.trim())
    .refine(
      (val) =>
        val.trim().length === 0
          ? true
          : defaultTronWeb
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (defaultTronWeb as any).isAddress(val.replace('0x', ''))
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
          .refine((val) => val.trim().length > 0 && !val.includes(' '), {
            message: 'Please enter the field name without spaces',
          }),
        // desc: z.string().optional(),
      })
    )
    .nonempty({ message: 'At least one schema declaration is required' }),
});

export const CreateSchemaForm: IComponent = () => {
  const { tronWeb, connected } = useTron();

  const [submitting, setSubmitting] = useState(false);
  const { open: openTxResult } = useTxResult();
  const form = useForm({
    resolver: zodResolver(baseFormSchema),
    defaultValues: {
      [SchemaFieldKeys.Name]: '',
      // [SchemaFieldKeys.Description]: '',
      [SchemaFieldKeys.ResolverAddress]: '',
      [SchemaFieldKeys.Revocable]: true,
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

  const { data: contract } = useSchemaContract();

  const handlePressSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    if (connected && tronWeb && contract) {
      const schema = (
        values[SchemaFieldKeys.DeclareStmts] as {
          token: string;
          type: string;
          // desc: string;
        }[]
      )
        .map((item) => `${item.type} ${item.token}`)
        .join(',');

      try {
        const tx = await contract.send({
          method: 'register',
          args: [
            values[SchemaFieldKeys.Name] as string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            schema as string,
            (values[SchemaFieldKeys.ResolverAddress] as THexString) ||
              ('0x0000000000000000000000000000000000000000' as THexString),
            values[SchemaFieldKeys.Revocable] as boolean,
          ],
        });

        ToastTemplate.Schema.Submit();
        setSubmitting(false);
        openTxResult(tx);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        ToastTemplate.Schema.SubmitError();
        setSubmitting(false);
      }
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
          <FormLabel required>Schema definition</FormLabel>
          <div className="space-y-3">
            {fields.map((item, index) => {
              return (
                <div
                  key={item.key}
                  className="flex justify-between p-4 bg-gray-50 gap-4 rounded-lg">
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
                  {/* renderInputField({
                    name: SchemaDeclareDescKey(index) as TSchemaInput<TAPP_NAME>,
                    placeholder: 'Enter field description',
                    containerClassName: 'grow space-y-0',
                  }) */}
                  <Button
                    disabled={fields.length === 1}
                    type="button"
                    className="bg-white hover:text-white group"
                    onClick={() => handleRemoveField(index)}>
                    <TrashIcon className="w-4 h-4 text-accent-foreground group-hover:text-white" />
                  </Button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={handleAddField}
              className="mt-2 py-2 px-4 text-primary flex items-center gap-2 bg-white hover:bg-red-50/60 duration-150 transition-all rounded-lg">
              <PlusIcon className="w-4 h-4 mr-1" />
              Add field
            </button>
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
            <FormItem>
              <FormLabel>Revocable</FormLabel>
              <TabSwitch
                tabs={['No', 'Yes']}
                selectedTab={field.value ? 'Yes' : 'No'}
                onChange={(value) => {
                  return field.onChange(value === 'Yes');
                }}
              />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-center !mt-12">
          {!connected && <AccountConnect />}
          {connected && (
            <Button
              type={'submit'}
              className="px-4 bg-gray-800 hover:bg-black rounded-xl"
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
      </form>
    </Form>
  );
};
