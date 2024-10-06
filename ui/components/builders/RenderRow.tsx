'use client';

import { useRouter } from 'next/navigation';

import { AppRouter } from '@/constants/router';
import {
  cx,
  getRelativeTime,
  isCredentialValid,
  isZeroAddress,
  toTronAddress,
} from '@/utils/tools';

import { TableCell, TableRow } from '../shadcn/Table';
import { Chip } from './Chip';
import { HexLink } from './HexLink';

export const CredentialRow = ({
  uid,
  schema,
  issuer,
  recipient,
  expirationTime,
  revocationTime,
  timestamp,
  type,
}: TCredential) => {
  const isValid = isCredentialValid(revocationTime, expirationTime);

  const router = useRouter();

  return (
    <TableRow
      key={uid}
      className={cx({
        'bg-gray-200 hover:bg-gray-300 !text-gray-500': !isValid,
      })}>
      <TableCell>
        <HexLink
          content={uid}
          href={`${AppRouter.Credentials}/${uid}?type=${type}`}
          className={cx({
            'text-gray-500': !isValid,
          })}
        />
      </TableCell>
      <TableCell>
        <button
          className="w-fit flex items-center gap-2 border p-2 my-2 rounded-lg hover:bg-opacity-80"
          onClick={() => {
            console.log({ schema });
            router.push(`${AppRouter.Schemas}/${schema?.uid}`);
          }}>
          <Chip text={`#${schema?.id}`} color={!isValid ? 'gray' : undefined} />
          <span className="text-base font-semibold">{schema?.name}</span>
        </button>
      </TableCell>
      <TableCell>
        <HexLink
          content={toTronAddress(issuer)}
          href={`${AppRouter.Address}/${toTronAddress(issuer)}`}
          className={cx({
            'text-gray-500': !isValid,
          })}
        />
      </TableCell>
      <TableCell>
        <HexLink
          content={toTronAddress(recipient)}
          href={`${AppRouter.Address}/${toTronAddress(recipient)}`}
          className={cx({
            'text-gray-500': !isValid,
          })}
        />
      </TableCell>
      <TableCell>
        {isValid ? (
          <span className="font-bold text-green-700">Yes</span>
        ) : (
          <span className="font-bold text-red-700">No</span>
        )}
      </TableCell>
      <TableCell>{getRelativeTime(timestamp)}</TableCell>
    </TableRow>
  );
};

export const CredentialSchemaRow = ({
  uid,
  issuer,
  recipient,
  time,
  type,
}: {
  uid: string;
  issuer: string;
  recipient: string;
  time: number;
  type: CredentialType;
}) => (
  <TableRow key={uid}>
    <TableCell className="w-40">
      <HexLink content={uid} href={`${AppRouter.Credentials}/${uid}?type=${type}`} />
    </TableCell>
    <TableCell className="w-80">
      <HexLink
        content={toTronAddress(issuer)}
        href={`${AppRouter.Address}/${toTronAddress(issuer)}`}
      />
    </TableCell>
    <TableCell className="w-80">
      <HexLink
        content={toTronAddress(recipient)}
        href={`${AppRouter.Address}/${toTronAddress(recipient)}`}
      />
    </TableCell>
    <TableCell>{getRelativeTime(time)}</TableCell>
  </TableRow>
);

export const SchemaRow = ({
  id,
  name,
  uid,
  definition,
  resolver,
  revocable /*timestamp*/,
}: SchemaData) => (
  <TableRow key={uid} className="text-lg">
    <TableCell>
      <Chip text={`#${id}`} href={`${AppRouter.Schemas}/${uid}`} />
    </TableCell>
    <TableCell>
      <HexLink content={uid} href={`${AppRouter.Schemas}/${uid}`} />
    </TableCell>
    <TableCell className="font-semibold">{name}</TableCell>
    <TableCell className="w-120">
      <ul className="flex flex-wrap gap-3">
        {definition?.map(({ fieldName, fieldType }, index) => (
          <li
            key={index}
            className="w-fit flex border text-white font-medium text-sm gap-1 p-1 rounded-md">
            <span className="py-1 px-2 w-fit uppercase bg-main rounded-md font-semibold">
              {fieldType}
            </span>
            <span className="py-1 px-2 w-fit bg-gray-700 rounded-md">{fieldName}</span>
          </li>
        ))}
      </ul>
    </TableCell>
    <TableCell className="mx-auto">
      <span
        className={cx(`ml-4`, {
          'text-orange-500': revocable,
          'text-gray-500': !revocable,
        })}>
        {revocable ? 'Yes' : 'No'}
      </span>
    </TableCell>
    <TableCell>
      {isZeroAddress(resolver) ? (
        'None'
      ) : (
        <HexLink content={resolver} href={`${AppRouter.Address}/${resolver}`} />
      )}
    </TableCell>
    {/* <TableCell>{getRelativeTime(timestamp ?? 0)}</TableCell> */}
  </TableRow>
);
