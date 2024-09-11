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

export const SchemaRow = ({ uid, schema, resolver, revocable }: SchemaData) => (
  <TableRow key={uid}>
    {/* <TableCell>
      <IdChip id={id} />
    </TableCell> */}
    <TableCell>
      <HexLink content={uid} />
    </TableCell>
    <TableCell className="w-120">
      <ul className="flex flex-wrap gap-3">
        {schema.map(({ fieldName, fieldType }) => (
          <li
            key={fieldName}
            className="py-1 px-4 border-radius bg-black w-fit rounded-md flex flex-col border">
            <span className="uppercase text-[10px] text-gray-400 font-medium">{fieldType}</span>
            <span className="font-semibold">{fieldName}</span>
            {/* <span>{fieldDescription}</span> */}
          </li>
        ))}
      </ul>
    </TableCell>
    <TableCell>
      <span
        className={`text-sm font-semibold text-white bg-${revocable ? 'destructive' : 'green'}-500 px-2 py-1 rounded-md`}>
        {revocable ? 'Yes' : 'No'}
      </span>
    </TableCell>
    <TableCell>
      <HexLink content={resolver} />
    </TableCell>
    <TableCell>{99999}</TableCell>
  </TableRow>
);
