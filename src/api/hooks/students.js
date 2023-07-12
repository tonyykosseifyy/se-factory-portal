import {useQuery} from 'react-query';
import {useAxios} from "../../context/axios";
import {buildStudentKey} from "../config/keys";

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

    const useStudents = (filter={}) => {
        const {Api} = useAxios()

        return useQuery({
            queryKey: buildStudentKey(),
            queryFn: async () =>
                Api.getStudents().then(({data}) => data.data),
            ...defaultOptions,
            staleTime: 1000000,
        });
    }

    return {
        useStudents
    }
}