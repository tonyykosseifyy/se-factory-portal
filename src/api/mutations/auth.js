import {CURRENT_USER_KEY, MUTATION_KEYS} from "../config/keys";
import Cookies from "js-cookie";

export default (queryClient, queryConfig) => {
    queryClient.setMutationDefaults(MUTATION_KEYS.LOGIN_USER, {
        mutationFn: async ({Api,payload}) =>
            Api.postLogin(payload).then((data) => (data)),
        onSuccess: (data) => {
            queryClient.setQueryData(CURRENT_USER_KEY, data.data.user)
            Cookies.set('se-token', data.data.jwt)
        },
        onError: (error, _, context) => {

        },
        onSettled: () => {
        },
    });

}