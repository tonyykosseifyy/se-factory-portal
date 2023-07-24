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

    const useStudents = (filter={}) => {
        const { Api } = useAxios();

        console.log(filter);

        const query_string = qs.stringify( filter , { encode: false } );
        console.log('query_string',query_string);

        return useQuery({
            queryKey: [buildStudentKey(), filter],
            queryFn: async () =>
                Api.getStudents(query_string).then(({data}) => data),
            ...defaultOptions,
            staleTime: 1000000,
        });
    }

    return {
        useStudents
    }
}

// // filters: {
        //     languages : {
        //         language: { $in: ['Angular'] }
        //     },
        //     project_types: {
        //         project_type: { $in: ['Website'] }
        //     }
        //     // languages : {
        //     //   language: { $in: ['Angular'] }
        //     // },
        //     // // project_types: {
        //     // //   id: { $in: 22 }
        //     // // },
        //   },