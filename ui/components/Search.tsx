import { useActionDebounce } from '@/hooks/useAction';
import { SearchIcon, Slash } from 'lucide-react';
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

      console.log({ parsedData });
    },
    enabled: !!query,
  });

  console.log(data, isFetching);

  return (
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
  );
};
