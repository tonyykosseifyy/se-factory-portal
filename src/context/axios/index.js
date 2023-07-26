import React, {useEffect, useState} from 'react'
import {useMemo} from "react";
import Axios from 'axios'
import Cookies from 'js-cookie';
import {AUTHENTICATION_API_ROUTE, FAVORITES_API_ROUTE, STUDENTS_API_ROUTE, USER_API_ROUTE, STUDENTS_FAVORITE_ROUTE } from "./api-routes";


const AxiosContext = React.createContext();

export default function AxiosProvider({ children }) {
    const axios = useMemo(() => {
        const axios = Axios.create({
            baseURL: process.env.REACT_APP_API_HOST,
            headers: {
                "Content-Type": "application/json",
            },
        });

        axios.interceptors.request.use((config) => {
            const token = Cookies.get("se-token")
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });

        return axios;
    }, []);

    const displayError = (err) => {
        return {
            data: {
                data: [],
                message: 'Error'
            }
        }
    }
    // Students
    const getStudents = (query_string) =>
        axios.get(STUDENTS_API_ROUTE+query_string).then(data => data);

    // User
    const postLogin = ({email, password}) =>
        fetch(process.env.REACT_APP_API_HOST+AUTHENTICATION_API_ROUTE).then(data => data);

    const getUser = () => axios.get(USER_API_ROUTE).then(data => data);

    // Favorites
    const getFavorites = (filter='?populate=*&pagination[page]=1&pagination[pageSize]=100') => axios.get(FAVORITES_API_ROUTE+filter).then(data => data);

    const createFavorite = (id) => {
        try {
            return axios.post(STUDENTS_FAVORITE_ROUTE + `/addFavorite/${id}`) ;
        } catch(err) {
            return displayError(err);
        }
    }
    
    const deleteFavorite = (id) => {
        try {
            return axios.delete(STUDENTS_FAVORITE_ROUTE + `/deleteFavorite/${id}`) ;
        } catch(err) {
            return displayError(err);
        }
    }
    return (
        <AxiosContext.Provider value={{
            axios,
            Api : {
                getStudents,
                postLogin,
                getUser,
                getFavorites,
                createFavorite,
                deleteFavorite
            }
        }}>{children}</AxiosContext.Provider>
    );
}

export const useAxios = () => {
    const context = React.useContext(AxiosContext);
    if (context === undefined) {
        throw new Error('useAxios must be used within a AxiosContextProvider');
    }

    const { axios, Api } = context

    return {
        axios,
        Api
    }
}