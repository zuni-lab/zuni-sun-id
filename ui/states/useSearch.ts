import { create } from 'zustand';

interface ISearchState {
  query: string;
  setQuery: (search: string) => void;
}

export const useSearch = create<ISearchState>((set) => ({
  query: '',
  setQuery: (query: string) => {
    set({ query });
  },
}));
