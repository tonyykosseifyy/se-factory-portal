import {QueryClient, QueryClientProvider, useMutation} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';
import {CACHE_TIME_MILLISECONDS, STALE_TIME_MILLISECONDS,} from './config/constants';
import configureHooks from './hooks';
import configureMutations from './mutations';


const configureQueryClient = (config) => {
    const baseConfig = {
        API_HOST:
            config?.API_HOST ||
            process.env.REACT_APP_API_HOST,
        keepPreviousData: config?.keepPreviousData || false,
    };

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: config?.refetchOnWindowFocus || false,
            },
        },
    });

    const queryConfig = {
        ...baseConfig,
        staleTime: config?.staleTime || STALE_TIME_MILLISECONDS,
        cacheTime: config?.cacheTime || CACHE_TIME_MILLISECONDS,
    };

    const hooks = configureHooks(queryClient, queryConfig);

    configureMutations(queryClient, queryConfig);

    return {
        queryClient,
        QueryClientProvider,
        hooks,
        useMutation,
        ReactQueryDevtools,
    };
};

export default configureQueryClient
