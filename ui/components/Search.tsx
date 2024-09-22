import { useActionDebounce } from '@/hooks/useAction';
import { Loader, SearchIcon, Slash } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from './shadcn/Button';
import { Input } from './shadcn/Input';
import { useQuery } from '@tanstack/react-query';
import { CredentialApi } from '@/api/credential';

export const Search: IComponent<{
  placeholder?: string;
}> = ({ placeholder = 'Search...' }) => {
  const [query, setQuery] = useState<string>('');
  const debounce = useActionDebounce(1000, true);

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

  const { data, isFetching } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const response = await CredentialApi.search({ uid: query });
      if (!response) {
        return;
      }
      const parsedData: TCredential = {
        uid: response.uid,
        issuer: response.issuer,
        signature: response.signature,
        schemaUID: response.schema_uid,
        recipient: response.recipient,
        expiration: response.expiration_time,
        revocable: response.revocable,
        refUID: response.ref_uid,
        data: response.data,
        createdAt: response.created_at,
      };

      return parsedData;
    },
    enabled: !!query,
  });

  return (
    <div className="flex flex-col divide-y divide-white max-w-4xl">
      <div className="w-full flex items-center float-end bg-accent px-2 rounded-2xl">
        <Button size={'lg'} variant={'link'} className="px-2 cursor-default">
          <SearchIcon className="w-5 h-5" />
        </Button>
        <Input
          placeholder={placeholder}
          className="focus:!border-none bg-transparent placeholder:text-gray-500"
          onChange={onSearch}
          // value={query}
        />
        <Button
          size={'lg'}
          variant={'link'}
          className="h-fit w-fit mr-2 px-1 py-2 cursor-pointer border border-muted-foreground hover:text-gray-500 hover:border-muted-foreground"
          onClick={clearSearch}>
          <Slash className="w-4 h-4" />
        </Button>
      </div>
      {isFetching && (
        <div className="bg-accent px-2 mt-1 border-t border-white rounded-xl min-h-32">
          <div className="h-full w-full flex items-center justify-center py-8">
            <Loader className="w-10 h-10 animate-spin" />
          </div>
        </div>
      )}
      {data && (
        <div className="bg-accent px-2 mt-1 border-t border-white rounded-xl min-h-32 max-w-full">
          <div className="h-full w-full flex items-center justify-center py-8">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
