import { cx } from '@/utils/tools';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontal } from 'lucide-react';

export const PaginationButton: IComponent<{
  page?: number;
  size?: number;
  totalPage: number;
  maxPageItems?: number;
  onChangePage?: (page: number) => void;
}> = ({ maxPageItems = 5, onChangePage, page = 0, size = 32, totalPage = 1 }) => {
  const MAX_PAGE_ITEMS = maxPageItems; // Maximum number of page items to show
  const HALF_PAGE_ITEMS = Math.floor(MAX_PAGE_ITEMS / 2); // Half of the maximum number of page items

  // Calculate the start and end page numbers to show
  let startPage = Math.max(0, page - 1 - HALF_PAGE_ITEMS);
  let endPage = Math.min(totalPage - 1, page - 1 + HALF_PAGE_ITEMS);

  // Add ellipses if there are more pages before or after the current subset
  if (startPage > 0) {
    startPage++;
  }
  if (endPage < totalPage - 1) {
    endPage--;
  }

  return (
    <div className="flex justify-center items-center sm:gap-2">
      <button
        disabled={page === 1}
        onClick={() => page > 1 && onChangePage?.(page - 1)}
        style={{ minHeight: size, minWidth: size }}
        className="flex justify-center items-center text-gray disabled: disabled:bg-gray3 border border-gray3 rounded hover:bg-gray-100">
        <ChevronLeftIcon width={16} height={16} />
      </button>
      {startPage > 0 && (
        <button
          onClick={() => onChangePage?.(1)}
          style={{ minHeight: size, minWidth: size }}
          className="flex justify-center items-center text-gray border border-gray3 rounded hover:bg-gray-500">
          1
        </button>
      )}
      {startPage > 1 && (
        <div
          style={{ minHeight: size, minWidth: size }}
          className="flex items-center justify-center border border-gray3 rounded pt-2">
          <MoreHorizontal className="w-5 h-5" />
        </div>
      )}
      {Array.from({ length: totalPage }).map((_, idx) => {
        if (idx < startPage || idx > endPage) {
          return null;
        }
        return (
          <button
            key={idx}
            onClick={() => onChangePage?.(idx + 1)}
            style={{ minHeight: size, minWidth: size }}
            className={cx('flex justify-center items-center border rounded', {
              'text-gray border-gray3 hover:bg-gray-500': idx !== page - 1,
              'text-main border-main hover:opacity-80': idx === page - 1,
            })}>
            {idx + 1}
          </button>
        );
      })}
      {endPage < totalPage - 2 && (
        <div
          style={{ minHeight: size, minWidth: size }}
          className="flex items-center justify-center border border-gray3 rounded pt-2">
          <MoreHorizontal className="w-5 h-5" />
        </div>
      )}
      {endPage < totalPage - 1 && (
        <button
          onClick={() => onChangePage?.(totalPage)}
          style={{ minHeight: size, minWidth: size }}
          className="flex justify-center items-center text-gray border border-gray3 rounded hover:bg-gray-500">
          {totalPage}
        </button>
      )}
      <button
        disabled={page === totalPage}
        onClick={() => page < totalPage && onChangePage?.(page + 1)}
        style={{ minHeight: size, minWidth: size }}
        className="flex justify-center items-center text-gray disabled: disabled:bg-gray3 border border-gray3 rounded hover:bg-gray-100">
        <ChevronRightIcon height={16} width={16} />
      </button>
    </div>
  );
};
