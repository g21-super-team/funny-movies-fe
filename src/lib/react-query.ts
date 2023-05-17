import { AxiosError } from "axios";
import {
  QueryClient,
  UseQueryOptions,
  UseMutationOptions,
  DefaultOptions,
} from "@tanstack/react-query";
import { Promisable } from "type-fest";

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type QueryConfig<FetcherFnType extends (...args: any) => any> =
  UseQueryOptions<Promisable<ReturnType<FetcherFnType>>>;

export type MutationConfig<FetcherFnType extends (...args: any) => any> =
  UseMutationOptions<
    Promisable<ReturnType<FetcherFnType>>,
    AxiosError,
    Parameters<FetcherFnType>[0]
  >;
