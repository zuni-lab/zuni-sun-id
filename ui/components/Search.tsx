import { useActionDebounce } from '@/hooks/useAction';
import { SearchIcon, Slash } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from './shadcn/Button';
import { Input } from './shadcn/Input';

export const Search: IComponent<{
  onSearchChange: (value: string) => void;
  placeholder?: string;
}> = ({ onSearchChange, placeholder = 'Search...' }) => {
  const [query, setQuery] = useState<string>('');
  const debounce = useActionDebounce(500, true);

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      debounce(() => {
        onSearchChange(e.target.value);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setQuery]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    onSearchChange('');
  }, [onSearchChange, setQuery]);

  return (
    <div className="w-full flex items-center float-end bg-accent px-2 rounded-2xl">
      <Button size={'lg'} variant={'link'} className="px-2 text-white cursor-default">
        <SearchIcon className="w-5 h-5" />
      </Button>
      <Input
        placeholder={placeholder}
        className="focus:!border-none bg-transparent text-white placeholder:text-gray-500"
        onChange={onSearch}
        value={query}
      />
      <Button
        size={'lg'}
        variant={'link'}
        className="h-fit w-fit mr-2 px-1 py-2 text-white cursor-pointer border border-muted-foreground hover:text-gray-500 hover:border-muted-foreground"
        onClick={clearSearch}>
        <Slash className="w-4 h-4" />
      </Button>
    </div>
  );
};
