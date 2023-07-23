import {useQuery} from 'react-query';
import {useAxios} from "../../context/axios";
import {buildStudentKey} from "../config/keys";
import qs from 'qs';


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

    const useStudents = (filter={
        filters: {
            title: {
              $eq: 'hello',
            },
        },
    }) => {
        const { Api } = useAxios();

        // const query_string = qs.stringify({ filter: filter }, { encode: false });
        // console.log('query_string',query_string);

        return useQuery({
            queryKey: buildStudentKey(),
            queryFn: async () =>
                Api.getStudents().then(({data}) => data),
            ...defaultOptions,
            staleTime: 1000000,
        });
    }

    return {
        useStudents
    }
}