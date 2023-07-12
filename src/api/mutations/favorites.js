import {CURRENT_USER_KEY, FAVORITE_KEY, MUTATION_KEYS} from "../config/keys";
import Cookies from "js-cookie";

export default (queryClient, queryConfig) => {
    queryClient.setMutationDefaults(MUTATION_KEYS.POST_FAVORITE, {
        mutationFn: async ({Api,id}) =>
            Api.createFavorite(id).then((data) => (data)),
        onSuccess: (data) => {
            queryClient.invalidateQueries(FAVORITE_KEY)
        },
        onError: (error, _, context) => {

        },
        onSettled: () => {
        },
    });

    queryClient.setMutationDefaults(MUTATION_KEYS.DELETE_FAVORITE, {
        mutationFn: async ({Api,id}) =>
            Api.deleteFavorite(id).then((data) => (data)),
        onSuccess: (data) => {
            queryClient.invalidateQueries(FAVORITE_KEY)

            // console.log(data)
            // queryClient.setQueryData(CURRENT_USER_KEY, data.data.user)
            // Cookies.set('se-token', data.data.jwt)
        },
        onError: (error, _, context) => {

        },
        onSettled: () => {
        },
    });

}