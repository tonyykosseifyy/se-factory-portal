import configureStudents from './students';
import configureUser from './user';
import configureFavorite from './favorites';

export default (
    queryClient,
    queryConfig,
) => {
    return {
        ...configureStudents(queryClient, queryConfig),
        ...configureUser(queryClient, queryConfig),
        ...configureFavorite(queryClient, queryConfig),
    }
}