'use client';

import { AppRouter } from '@/constants/router';
import { cx, getRelativeTime } from '@/utils/tools';
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
}: TCredential) => {
  const isValid =
    (revocationTime == 0 || revocationTime * 1000 > new Date().getTime()) &&
    (expirationTime == 0 || expirationTime * 1000 > new Date().getTime());

  return (
    <TableRow
      key={uid}
      className={cx({
        'bg-gray-300': !isValid,
      })}>
      <TableCell className="w-40">
        <HexLink content={uid} href={`${AppRouter.Credential}/${uid}`} />
      </TableCell>
      <TableCell className="flex items-center gap-2 border p-2 my-2 rounded-lg">
        <Chip text={`#${schema?.id}`} />
        <span className="text-base font-semibold">{schema?.name}</span>
      </TableCell>
      <TableCell className="w-80">
        <HexLink content={issuer} href={`${AppRouter.Address}/${issuer}`} />
      </TableCell>
      <TableCell className="w-80">
        <HexLink content={recipient} href={`${AppRouter.Address}/${recipient}`} />
      </TableCell>
      <TableCell>{isValid ? 'Yes' : 'No'}</TableCell>
      <TableCell>{getRelativeTime(timestamp)}</TableCell>
    </TableRow>
  );
};

export const CredentialSchemaRow = ({
  uid,
  issuer,
  recipient,
  time,
}: {
  uid: string;
  issuer: string;
  recipient: string;
  time: number;
}) => (
  <TableRow key={uid}>
    <TableCell className="w-40">
      <HexLink content={uid} href={`${AppRouter.Credential}/${uid}`} />
    </TableCell>
    <TableCell className="w-80">
      <HexLink content={issuer} href={`${AppRouter.Address}/${issuer}`} />
    </TableCell>
    <TableCell className="w-80">
      <HexLink content={recipient} href={`${AppRouter.Address}/${recipient}`} />
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
      <Chip text={`#${id}`} href={`${AppRouter.Schema}/${uid}`} />
    </TableCell>
    <TableCell>
      <HexLink content={uid} href={`${AppRouter.Schema}/${uid}`} />
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
      <HexLink content={resolver} href={`${AppRouter.Address}/${resolver}`} />
    </TableCell>
    {/* <TableCell>{getRelativeTime(timestamp ?? 0)}</TableCell> */}
  </TableRow>
);
