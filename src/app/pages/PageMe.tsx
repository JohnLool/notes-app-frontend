import React from "react";
import {AppDispatch} from "../../utils/store.ts";
import {useDispatch} from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";
import {setAccountAuthorized} from "../../slices/accountSlice.ts";

const PageMe: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();

    const clear = () => {
        Cookies.remove('token');
        delete axios.defaults.headers.common['Authorization'];
        dispatch(setAccountAuthorized(false));
    }

    return (
        <div>
            <button
                className="btn btn-primary bg-red-500 px-6 py-2"
                onClick={clear}
            >
                logout
            </button>
        </div>
    )
}

export default PageMe;
