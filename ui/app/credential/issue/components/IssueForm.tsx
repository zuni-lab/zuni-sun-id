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

import { AccountConnect } from '@/components/account/AccountConnect';
import { Chip } from '@/components/builders/Chip';
import { HexLink } from '@/components/builders/HexLink';
import { TabSwitch } from '@/components/builders/TabSwitch';
import { Button } from '@/components/shadcn/Button';
import { globalTronWeb, useTronWeb } from '@/components/TronProvider';
import { APP_NAME, TAPP_NAME } from '@/constants/configs';
import { AppRouter } from '@/constants/router';
import { ToastTemplate } from '@/constants/toast';
import { useTxResult } from '@/states/useTxResult';
import { getCredentialContract } from '@/tron/contract';
import { getValidationSchema } from '@/utils/schema';
import { isValidAddress, isValidBytesWithLength } from '@/utils/tools';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { cx } from 'class-variance-authority';
import { Loader } from 'lucide-react';
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
  [CredentialFieldKeys.Revocable]: false,
};

const generateDynamicDefaultValues = (definitions: TSchemaDefinitions) => {
  let result = { ...baseDefaultValues };

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
  const tronweb = useTronWeb();

  const { open: openTxResult } = useTxResult();

  const [submitting, setSubmitting] = useState(false);

  const dynamicSchema = getValidationSchema(data.definition);

  const combinedSchema = baseCredentialSchema.extend(dynamicSchema.shape);

  const defaultValues = generateDynamicDefaultValues(data.definition);

  const form = useForm({
    resolver: zodResolver(combinedSchema),
    defaultValues,
  });

  const { control, handleSubmit } = form;

  const handlePressSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    if (connected && window.tronWeb) {
      const contract = await getCredentialContract();

      const dataTypes: string[] = [];
      const dataValues: unknown[] = [];

      data.definition.map((field) => {
        dataTypes.push(field.fieldType);
        dataValues.push(values[field.fieldName]);
      });
      const rawData = tronweb.utils.abi.encodeParams(dataTypes, dataValues);

      const expiration = values[CredentialFieldKeys.Expiration]
        ? new Date(values[CredentialFieldKeys.Expiration] as string).getTime() / 1000
        : 2 ** 32 - 1;

      const recipient =
        (values[CredentialFieldKeys.Recipient] as string).length > 0
          ? values[CredentialFieldKeys.Recipient]
          : '0x' + ''.padEnd(40, '0');

      const refUID = values[CredentialFieldKeys.RefUID]
        ? values[CredentialFieldKeys.RefUID]
        : '0x' + ''.padEnd(64, '0');

      const args = [
        data.uid,
        recipient,
        expiration,
        values[CredentialFieldKeys.Revocable],
        refUID,
        rawData,
      ];

      try {
        const tx = await contract.send({
          method: 'issue',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          args: [args] as any,
        });

        ToastTemplate.Schema.Submit(tx);
        setSubmitting(false);
        openTxResult(tx);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error);
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
      name: TCredentialInput;
      placeholder: string;
      label?: string | React.ReactNode;
      type?: 'text' | 'datetime-local';
      className?: string;
      containerClassName?: string;
      required?: boolean;
      description?: string;
    }) => {
      return (
        <FormField
          key={name}
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
      <FormLabel className="!my-8">SCHEMA</FormLabel>
      <div className="border-input px-4 flex items-center justify-between rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <Chip className="font-bold text-xl" text={data.name.toUpperCase()} />
          <HexLink
            content={'#' + data.uid}
            href={`${AppRouter.Schema}/${data.uid}`}
            className="text-base pl-0"
            isFull
          />
        </div>
      </div>

      <form onSubmit={handlePressSubmit} className="space-y-4">
        {renderInputField({
          name: CredentialFieldKeys.Recipient as TCredentialInput,
          label: 'Recipient',
          placeholder: 'The optional recipient address, etc: TEg.. or 0x...',
          required: false,
        })}

        {data.definition.map((d) => {
          if (d.fieldType === 'bool') {
            return (
              <FormField
                key={d.fieldName}
                control={control}
                name={d.fieldName}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel required>
                        <span className="pr-1">
                          <span className="uppercase">{d.fieldName}</span> |{' '}
                          <span className="lowercase text-muted-foreground">{d.fieldType}</span>
                        </span>
                      </FormLabel>
                      <TabSwitch
                        tabs={['No', 'Yes']}
                        selectedTab={field.value ? 'Yes' : 'No'}
                        onChange={(value) => {
                          return field.onChange(value === 'Yes');
                        }}
                      />
                    </FormItem>
                  );
                }}
              />
            );
          }
          return renderInputField({
            name: d.fieldName as TCredentialInput,
            label: (
              <span className="pr-1">
                <span className="uppercase">{d.fieldName}</span> |{' '}
                <span className="lowercase text-muted-foreground">{d.fieldType}</span>
              </span>
            ),
            placeholder: "Enter field's value",
            required: false,
          });
        })}

        <div className="px-6 pb-8 pt-6 bg-gray-200 rounded-lg space-y-4 !my-6">
          <h2 className="text-xl font-semibold text-center">Advanced options</h2>
          {renderInputField({
            name: CredentialFieldKeys.Expiration as TCredentialInput,
            label: 'Expiration',
            type: 'datetime-local',
            placeholder: 'Set the expiration date for the credential',
            required: false,
          })}

          {renderInputField({
            name: CredentialFieldKeys.RefUID as TCredentialInput,
            label: 'Ref UID',
            placeholder: 'The UID of the reference credential, etc: 0x...',
            required: false,
          })}

          <FormField
            control={control}
            name={CredentialFieldKeys.Revocable}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase">Revocable</FormLabel>
                <FormMessage>
                  {/* {field.value ? 'The credential is revocable' : 'The credential is not revocable'} */}
                  {!data.revocable
                    ? 'The credential is not revocable because the schema configuration does not allow it.'
                    : field.value
                      ? 'The credential is revocable.'
                      : 'The credential is not revocable.'}
                </FormMessage>
                <TabSwitch
                  tabs={['No', 'Yes']}
                  selectedTab={field.value ? 'Yes' : 'No'}
                  onChange={(value) => {
                    return field.onChange(value === 'Yes');
                  }}
                  disabled={!data.revocable}
                />
              </FormItem>
            )}
          />
        </div>

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
        </div>
      </form>
    </Form>
  );
};
