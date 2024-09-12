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
import React, { useEffect, useRef } from 'react';
import { PaginationButton } from '../PaginationButton';
import { Skeleton } from '../shadcn/Skeleton';

interface SunTableProps<T> {
  title: string;
  columns: { label: string; className?: string }[];
  items: T[];
  renderRow: (row: T, index?: number) => JSX.Element;
  renderRightTop?: JSX.Element;
  isLoading?: boolean;
  footerButton?: React.ReactNode;
  initialSkeleton?: number;
  maxItems?: number;
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
  maxItems = 10,
  pagination,
  initialSkeleton = 10,
}: SunTableProps<T>) => {
  if (pagination && footerButton) {
    throw new Error('Cannot have both pagination and footer button');
  }

  const maxPage = items && Math.ceil((pagination?.totalItems ?? 0) / maxItems);

  const prevItemCount = useRef(initialSkeleton);

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
              <TableCell colSpan={columns.length}>{footerButton}</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>

      {!isLoading && items.length > 0 && pagination && !!maxPage && maxPage > 1 && (
        <div className="mt-4 flex justify-end gap-4 items-center border-t py-4">
          <span className="hidden sm:flex">
            {(pagination?.currentPage ?? 1) * maxItems - maxItems + 1} -{' '}
            {(pagination?.currentPage ?? 1) * maxItems} / {pagination.totalItems}
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
