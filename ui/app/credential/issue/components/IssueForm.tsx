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
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { CredentialApi } from '@/api/credential';
import { ConnectButton } from '@/components/account/AccountConnect';
import { HexLink } from '@/components/builders/HexLink';
import { TabSwitch } from '@/components/builders/TabSwitch';
import { Button } from '@/components/shadcn/Button';
import { defaultTronWeb, useTron, useTronWeb } from '@/components/TronProvider';
import { APP_NAME, TAPP_NAME } from '@/constants/configs';
import { AppRouter } from '@/constants/router';
import { ToastTemplate } from '@/constants/toast';
import { useCredentialContract, useSignCredentialOffChain } from '@/hooks/useContract';
import { useTxResult } from '@/states/useTxResult';
import { getValidationSchema } from '@/utils/schema';
import { cx, isValidAddress, isValidBytesWithLength, toHexAddress } from '@/utils/tools';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { ChevronDownIcon, Loader } from 'lucide-react';
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
            (defaultTronWeb as any)?.isAddress(val.replace('0x', '')) || isValidAddress(val),
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

const submitTypes: Record<'onchain' | 'offchain', string> = {
  onchain: 'Onchain Submit',
  offchain: 'Offchain Submit',
};

export const IssueCredentialForm: IComponent<{
  data: SchemaData;
}> = ({ data }) => {
  const tronWeb = useTronWeb();
  const { connected, address } = useTron();

  const [submitType, setSubmitType] = useState<'onchain' | 'offchain'>('onchain');

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

  const { data: contract } = useCredentialContract();

  const { mutateAsync: signOffchain } = useSignCredentialOffChain();

  const handlePressSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    if (connected && tronWeb && address && contract) {
      const dataTypes: string[] = [];
      const dataValues: unknown[] = [];

      data.definition.map((field) => {
        dataTypes.push(field.fieldType);
        dataValues.push(values[field.fieldName]);
      });
      const rawData = tronWeb.utils.abi.encodeParams(dataTypes, dataValues);

      const expiration = values[CredentialFieldKeys.Expiration]
        ? new Date(values[CredentialFieldKeys.Expiration] as string).getTime() / 1000
        : 0;

      const recipient =
        (values[CredentialFieldKeys.Recipient] as string).length > 0
          ? values[CredentialFieldKeys.Recipient]
          : '0x' + ''.padEnd(40, '0');

      const refUID = values[CredentialFieldKeys.RefUID]
        ? values[CredentialFieldKeys.RefUID]
        : '0x' + ''.padEnd(64, '0');

      try {
        if (submitType === 'onchain') {
          const args = [
            data.uid,
            recipient,
            expiration,
            values[CredentialFieldKeys.Revocable],
            refUID,
            rawData,
          ];

          const tx = await contract.send({
            method: 'issue',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            args: [args] as any,
          });

          ToastTemplate.Credential.SubmitOnChain();

          openTxResult(tx);
        } else {
          const recipient = toHexAddress(values[CredentialFieldKeys.Recipient] as string);

          const signature = await signOffchain({
            schemaUID: data.uid,
            recipient: recipient,
            expirationTime: expiration,
            revocable: values[CredentialFieldKeys.Revocable] as boolean,
            refUID: refUID,
            data: rawData,
          });
          await CredentialApi.issue({
            issuer: `0x${tronWeb.address.toHex(address).replace('41', '')}`,
            signature: signature as THexString,
            schema_uid: data.uid as THexString,
            recipient,
            expiration_time: expiration,
            revocable: values[CredentialFieldKeys.Revocable] as boolean,
            ref_uid: refUID as THexString,
            data: rawData,
          });

          ToastTemplate.Credential.SubmitOffChain();
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error);
        ToastTemplate.Schema.SubmitError();
      } finally {
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

      <div className="bg-red-50/60 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <span className="h-14 aspect-square bg-primary text-white flex items-center justify-center rounded-lg text-lg">
            #{data.id}
          </span>
          <div className="flex flex-col justify-center">
            <h3 className="uppercase text-gray-600 font-bold text-lg">{data.name}</h3>
            <HexLink
              content={'#' + data.uid}
              href={`${AppRouter.Schemas}/${data.uid}`}
              className="text-base pl-0 text-gray-500"
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
          <h2 className="text-xl font-semibold text-center text-gray-700">Advanced options</h2>
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
                <FormMessage className="text-gray-500">
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

        <div className="flex items-center justify-center !mt-12">
          {!connected && <ConnectButton />}
          {connected && (
            <div
              className={cx('flex items-center rounded-xl overflow-hidden w-52', {
                'cursor-pointer': connected,
                'cursor-not-allowed': !connected,
                'bg-green-600': submitType === 'onchain',
                'bg-orange-500': submitType === 'offchain',
                'bg-gray-500': submitting,
              })}>
              <Button
                type={'submit'}
                className={cx('px-4 rounded-r-none grow', {
                  'bg-green-600 hover:bg-green-500': submitType === 'onchain',
                  'bg-orange-500 hover:bg-orange-400': submitType === 'offchain',
                  'bg-gray-500': submitting,
                })}
                size={'lg'}
                disabled={submitting}>
                {submitting ? (
                  <Loader className="w-4 h-4 text-background animate-spin" />
                ) : (
                  submitTypes[submitType]
                )}
              </Button>
              <DropdownButton onSelect={(val) => setSubmitType(val)} />
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};

const DropdownButton: IComponent<{
  onSelect: (val: 'onchain' | 'offchain') => void;
}> = ({ onSelect }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        asChild
        className="w-1/4 cursor-pointer border-l border-white hover:opacity-80">
        <div className="h-full py-3">
          <ChevronDownIcon
            className="w-6 h-6 mx-auto text-white font-bold"
            aria-hidden="true"
            strokeWidth={2}
          />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={clsx(
            'h-42 inline-flex w-60 flex-col items-start justify-start gap-2',
            'rounded-lg bg-opacity-90 px-4 py-4 shadow backdrop-blur-2xl text-lg bg-white'
          )}>
          {Object.entries(submitTypes).map(([key, value]) => (
            <DropdownMenu.Item
              key={key}
              onSelect={() => onSelect(key as 'onchain' | 'offchain')}
              className="cursor-pointer py-2 px-4 hover:bg-gray-400 hover:text-white w-full rounded-lg outline-none duration-150 transition-all">
              {value}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
