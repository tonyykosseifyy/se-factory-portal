export const buildStudentKey = (filter='') => 'students' +  filter
export const CURRENT_USER_KEY = 'current-user'
export const FAVORITE_KEY = "favorites"
export const MUTATION_KEYS = {
    LOGIN_USER: "postLogin",
    POST_FAVORITE: 'postFavorite',
    DELETE_FAVORITE: 'deleteFavorite'
}