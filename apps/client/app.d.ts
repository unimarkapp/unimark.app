import type {
  QueryObserverResult,
  UseQueryOptions,
} from "@tanstack/react-query";
import { KyNetworkError } from "@/shared/request";

declare module "@tanstack/react-query" {
  export function useQuery<
    TData = unknown,
    TError = KyNetworkError,
    TQueryFnData = TData,
  >(
    options: UseQueryOptions<TData, TError, TQueryFnData>
  ): QueryObserverResult<TData, TError>;
}
