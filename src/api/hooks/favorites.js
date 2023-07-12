import {useQuery} from 'react-query';
import {useAxios} from "../../context/axios";
import {FAVORITE_KEY, STUDENTS_KEY} from "../config/keys";

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

    const useFavorites = () => {
        const {Api} = useAxios()

        return useQuery({
            queryKey: FAVORITE_KEY,
            queryFn: async () =>
                Api.getFavorites().then(({data}) => data.data),
            ...defaultOptions,
            staleTime: 1000000
        });
    }

    return {
        useFavorites
    }
}