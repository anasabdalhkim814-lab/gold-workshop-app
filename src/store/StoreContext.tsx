import { createContext, useContext } from 'react';
import { StoreType } from './useStore';

export const StoreContext = createContext<StoreType | null>(null);

export function useStoreContext(): StoreType {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('StoreContext not provided');
  return ctx;
}
