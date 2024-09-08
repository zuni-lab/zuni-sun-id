'use client';

import { getRelativeTime } from '@/utils/tools';
import { TableCell, TableRow } from '../shadcn/Table';
import { HexLink } from './HexLink';
import { IdChip } from './IdChip';

export const ClaimRow = ({ uuid, schemaId, from, to, type, time }: TClaim) => (
  <TableRow key={uuid}>
    <TableCell className="w-40">
      <HexLink content={uuid} />
    </TableCell>
    <TableCell>
      <IdChip id={schemaId} />
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

export const SchemaRow = ({
  id,
  uuid,
  schema,
  resolverAddresss,
  numberOfClaims,
}: TPresentableSchema) => (
  <TableRow key={uuid}>
    <TableCell>
      <IdChip id={id} />
    </TableCell>
    <TableCell>
      <HexLink content={uuid} />
    </TableCell>
    <TableCell className="w-120">
      <ul className="flex flex-wrap gap-3">
        {schema.map(({ token, type }) => (
          <li
            key={token}
            className="py-1 px-4 border-radius bg-black w-fit rounded-md flex flex-col border">
            <span className="uppercase text-[10px] text-gray-400 font-medium">{type}</span>
            <span className="font-semibold">{token}</span>
          </li>
        ))}
      </ul>
    </TableCell>
    <TableCell>{resolverAddresss}</TableCell>
    <TableCell>{numberOfClaims}</TableCell>
  </TableRow>
);
