import Cookies from "js-cookie";
import {AppDispatch} from "../utils/store.ts";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {setAccountAuthorized} from "../slices/accountSlice.ts";
import {setAppError, setAppLoading} from "../slices/appSlice.ts";
import {api} from "../utils/api.ts";

export const useAccount = () => {
    const dispatch: AppDispatch = useDispatch();

    const clear = () => {
        Cookies.remove('token');
        delete api.defaults.headers.common['Authorization'];
        dispatch(setAccountAuthorized(false));
    }

    const check = () => {
        dispatch(setAppLoading(true));
        const token = Cookies.get('token');

        if (token) {
            api.get('/users/me', {
                headers: {Authorization: `Bearer ${token}`}
            }).then((_response) => {
                Cookies.set('token', token, {expires: 1});
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                dispatch(setAccountAuthorized(true));
            }).catch((error) => {
                console.error(error);
                if (error.response && error.response.data) {
                    dispatch(setAppError(error.response.data));
                } else {
                    dispatch(setAppError(error.message));
                }
                clear();
            }).finally(() => {
                dispatch(setAppLoading(false));
            });
        } else {
            clear();
            dispatch(setAppLoading(false));
        }
    }

    useEffect(() => {
        check();

        const intervalId = setInterval(() => {
            console.log('check auth');
            check();
        }, 1000 * 60 * 10);

        return () => clearInterval(intervalId);
    }, [dispatch]);
}
