import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';


export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();



export const useQueryParams = () => {
 
  return {
    get: (key: string) => new URLSearchParams(window.location.search).get(key),
    set: (key: string, value: string) => {
      const params = new URLSearchParams(window.location.search)
      params.set(key, value)
      window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
    }
  }
}