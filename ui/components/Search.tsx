import { Loader, SearchIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { AppRouter } from '@/constants/router';
import { useActionDebounce } from '@/hooks/useAction';
import { useCombinedData } from '@/hooks/useCombinedData';
import { useSearch } from '@/states/useSearch';

import { Button } from './shadcn/Button';
import { Input } from './shadcn/Input';

const MAX_CHARS = 66;

const chunkContent = (content: string) => {
  const chunks: string[] = [];
  for (let i = 0; i < content.length; i += MAX_CHARS) {
    chunks.push(content.slice(i, i + MAX_CHARS));
  }
  return chunks;
};
export const SearchItem: IComponent<{
  title: string;
  content: string;
}> = ({ title, content }) => {
  const chunks = chunkContent(content);

  return (
    <div className="flex flex-col gap-2 py-2">
      <span className="text-sm font-semibold bg-red-500 text-white w-fit px-2 py-1 rounded-md">
        {title}
      </span>
      <div>
        {chunks.map((chunk, index) => (
          <p key={index} className="w-full text-[15px] text-sm font-bold">
            {chunk}
          </p>
        ))}
      </div>
    </div>
  );
};

export const Search: IComponent<{
  placeholder?: string;
}> = ({ placeholder = 'Search...' }) => {
  const { query, setQuery } = useSearch();
  const pathName = usePathname();

  useEffect(() => {
    setQuery('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  const debounce = useActionDebounce(1000, true);
  const router = useRouter();

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debounce(() => {
        setQuery(e.target.value);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setQuery]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
  }, [setQuery]);

  const { data, isFetching } = useCombinedData({ query });

  const handleClick = useCallback(() => {
    if (!data) {
      return;
    }
    if (data === 'address') {
      router.push(`${AppRouter.Address}/${query}`);
    } else if (data === 'schema') {
      router.push(`${AppRouter.Schemas}/${query}`);
    } else if (data === 'offchain') {
      router.push(`${AppRouter.Credentials}/${query}?type=offchain`);
    } else if (data === 'onchain') {
      router.push(`${AppRouter.Credentials}/${query}?type=onchain`);
    }

    setQuery('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, query]);

  return (
    <div className="flex flex-col divide-y divide-white max-w-4xl">
      <div className="relative w-full flex items-center float-end bg-accent px-2 rounded-2xl">
        <Button size={'lg'} variant={'link'} className="px-2 cursor-default">
          <SearchIcon className="w-5 h-5" />
        </Button>
        <Input
          placeholder={placeholder}
          className="focus:!border-none bg-transparent placeholder:text-gray-500 text-sm font-bold"
          onChange={onSearch}
        />
        {/* <Button
          size={'lg'}
          variant={'link'}
          className="h-4 w-fit mr-2 px-1 py-4 cursor-pointer border border-muted-foreground hover:text-gray-500 hover:border-muted-foreground"
          onClick={clearSearch}>
          <Slash className="w-4 h-4" />
        </Button> */}
        {query && isFetching && (
          <div className="absolute top-full left-0 right-0 bg-accent px-2 py-1 mt-1 rounded-xl w-full min-h-20 flex flex-col items-center justify-center cursor-pointer hover:bg-muted shadow-sm shadow-gray-200 border border-gray-200">
            <div className="h-full w-full flex items-center justify-center py-2">
              <Loader className="w-10 h-10 animate-spin" />
            </div>
          </div>
        )}
        {query && !isFetching && data && data !== 'none' && (
          <div
            className="absolute top-full left-0 right-0 bg-accent px-2 py-1 mt-1 rounded-xl w-full min-h-20 flex flex-col items-center justify-center cursor-pointer hover:bg-muted shadow-sm shadow-gray-200 border border-gray-200"
            onClick={handleClick}>
            <div className="h-full w-full flex items-center py-2 px-2" onClick={clearSearch}>
              <SearchItem
                title={
                  data === 'address'
                    ? 'Address'
                    : data === 'schema'
                      ? 'Schema'
                      : data === 'onchain'
                        ? 'Onchain Credential'
                        : data === 'offchain'
                          ? 'Offchain Credential'
                          : 'No result found'
                }
                content={query}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
