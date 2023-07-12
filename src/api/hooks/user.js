import {useQuery} from 'react-query';
import {useAxios} from "../../context/axios";
import {CURRENT_USER_KEY} from "../config/keys";

export default (
    queryClient,
    queryConfig,
) => {
    const {retry, cacheTime, staleTime} = queryConfig;
    const defaultOptions = {
        retry,
        cacheTime,
        staleTime,
    };

    const useCurrentUser = () => {
        const {Api} = useAxios()

        return useQuery({
            queryKey: CURRENT_USER_KEY,
            queryFn: async () =>
                Api.getUser().then(({data}) => data),
            ...defaultOptions,
            staleTime: 1000000
        });
    }

    return {
        useCurrentUser
    }
}