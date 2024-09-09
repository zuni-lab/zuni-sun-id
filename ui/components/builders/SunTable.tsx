'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/Table';
import { Button } from '../shadcn/Button';
import { useEffect, useRef } from 'react';
import { Skeleton } from '../shadcn/Skeleton';
import { PaginationButton } from '../PaginationButton';
import { ITEMS_PER_PAGE } from '@/constants/configs';
import { TronWebWithExt } from '@/types/tronWeb';
import { SCHEMA_REGISTRY_ABI } from '@/constants/abi';

interface SunTableProps<T> {
  title: string;
  columns: { label: string; className?: string }[];
  items: T[];
  renderRow: (row: T, index?: number) => JSX.Element;
  renderRightTop?: JSX.Element;
  isLoading?: boolean;
  footerButton?: string;
  initialSkeleton?: number;
  pagination?: {
    currentPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
}

export const SunTable = <T,>({
  title,
  columns,
  items,
  renderRow,
  renderRightTop,
  isLoading,
  footerButton,
  pagination,
  initialSkeleton = 10,
}: SunTableProps<T>) => {
  // const [items, setItems] = useState<SchemaData[]>([]);

  if (pagination && footerButton) {
    throw new Error('Cannot have both pagination and footer button');
  }

  const maxPage = items && Math.ceil((pagination?.totalItems ?? 0) / ITEMS_PER_PAGE);

  const prevItemCount = useRef(initialSkeleton);

  const fetchSchemeList = async () => {
    const events = await (
      tronWeb as TronWebWithExt
    ).event.getEventsByContractAddress<RegisterSchemaEvent>(SCHEMA_REGISTRY_ADDRESS, {
      page: 1,
      size: 10,
    });
    const schemas = events.map((event) => '0x' + event.result.uid);

    const contract = await (tronWeb as TronWebWithExt).contract(
      SCHEMA_REGISTRY_ABI,
      SCHEMA_REGISTRY_ADDRESS
    );
    const schemaCalls = [];
    for (const schema of schemas) {
      const getSchemaCall = await contract.getSchema(schema).call();
      schemaCalls.push(getSchemaCall);
    }
    const schemaList: SchemaData[] = await Promise.all(schemaCalls);
    console.log(schemaList);
  };

  useEffect(() => {
    fetchSchemeList();
  }, []);

  useEffect(() => {
    if (items && items.length > 0) {
      prevItemCount.current = items.length;
    }
  }, [items]);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium my-2 mb-4">{title}</h1>
        {renderRightTop}
      </div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {columns.map((col, index) => (
              <TableHead key={index} className={col.className}>
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {isLoading &&
          Array.from({ length: prevItemCount.current }).map((_, index) => (
            <TableRow key={index}>
              {columns.map((_, index) => (
                <TableCell key={index}>
                  <Skeleton className="w-full h-6" />
                </TableCell>
              ))}
            </TableRow>
          ))}

        {!isLoading && items.length === 0 && (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              No data available
            </TableCell>
          </TableRow>
        )}
        {!isLoading && items.length > 0 && <TableBody>{items.map(renderRow)}</TableBody>}
        {footerButton && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Button className="w-full" variant="link">
                  {footerButton}
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>

      {!isLoading && items.length > 0 && pagination && !!maxPage && maxPage > 1 && (
        <div className="mt-4 flex justify-end gap-4 items-center border-t py-4">
          <span className="hidden sm:flex">
            {(pagination?.currentPage ?? 1) * ITEMS_PER_PAGE - ITEMS_PER_PAGE + 1} -{' '}
            {(pagination?.currentPage ?? 1) * ITEMS_PER_PAGE} / {pagination.totalItems}
          </span>
          <PaginationButton
            // size={36}
            page={pagination.currentPage ?? 1}
            totalPage={maxPage ?? 1}
            onChangePage={pagination.onPageChange}
          />
        </div>
      )}
    </section>
  );
};
