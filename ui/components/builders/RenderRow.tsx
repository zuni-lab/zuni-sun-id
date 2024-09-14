'use client';

import { getRelativeTime } from '@/utils/tools';
import { TableCell, TableRow } from '../shadcn/Table';
import { HexLink } from './HexLink';
import { Chip } from './Chip';

export const ClaimRow = ({ uuid, schemaId, from, to, type, time }: TClaim) => (
  <TableRow key={uuid}>
    <TableCell className="w-40">
      <HexLink content={uuid} />
    </TableCell>
    <TableCell>
      <Chip text={schemaId} />
    </TableCell>
    <TableCell className="w-80">
      <HexLink content={from} />
    </TableCell>
    <TableCell className="w-80">
      <HexLink content={to} />
    </TableCell>
    <TableCell>{type}</TableCell>
    <TableCell>{getRelativeTime(time)}</TableCell>
  </TableRow>
);

export const SchemaRow = ({ name, uid, schema, resolver, revocable /*timestamp*/ }: SchemaData) => (
  <TableRow key={uid}>
    <TableCell>
      <HexLink content={uid} />
    </TableCell>
    <TableCell>{name}</TableCell>
    <TableCell className="w-120">
      <ul className="flex flex-wrap gap-3">
        {schema?.map(({ fieldName, fieldType }, index) => (
          <li
            key={index}
            className="py-1 px-4 border-radius bg-black w-fit rounded-md flex flex-col border">
            <span className="uppercase text-[10px] text-gray-400 font-medium">{fieldType}</span>
            <span className="font-semibold">{fieldName}</span>
          </li>
        ))}
      </ul>
    </TableCell>
    <TableCell className="mx-auto">
      <Chip className="ml-4" text={revocable ? 'Yes' : 'No'} color={revocable ? 'red' : 'gray'} />
    </TableCell>
    <TableCell>
      <HexLink content={resolver} />
    </TableCell>
    {/* <TableCell>{getRelativeTime(timestamp ?? 0)}</TableCell> */}
  </TableRow>
);
