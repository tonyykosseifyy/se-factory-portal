import authMutation from './auth';
import favoriteMutation from './favorites';

const configureMutations = (
    queryClient,
    queryConfig,
) => {
    authMutation(queryClient, queryConfig)
    favoriteMutation(queryClient, queryConfig)
}

export default configureMutations;