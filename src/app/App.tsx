import useDevice from "../hooks/useDevice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../utils/store.ts";
import {useAccount} from "../hooks/useAccount.ts";
import NotSupported from "./pages/NotSupported.tsx";
import {DeviceSize} from "../slices/deviceSlice.ts";
import AuthorizationPage from "./pages/AuthorizationPage.tsx";
import Cookies from "js-cookie";
import axios from "axios";
import {setAccountAuthorized} from "../slices/accountSlice.ts";
import ErrorMessage from "./components/ErrorMessage.tsx";
import Message from "./components/Message.tsx";

function App() {
    const dispatch: AppDispatch = useDispatch();

    useDevice();
    useAccount();

    const deviceSize = useSelector((state: RootState) => state.device.size);
    const deviceIsMobile = useSelector((state: RootState) => state.device.isMobile);
    const loading = useSelector((state: RootState) => state.app.loading);
    const error = useSelector((state: RootState) => state.app.error);
    const message = useSelector((state: RootState) => state.app.message);
    const authorized = useSelector((state: RootState) => state.account.authorized);

    const clear = () => {
        Cookies.remove('token');
        delete axios.defaults.headers.common['Authorization'];
        dispatch(setAccountAuthorized(false));
    }

    if (deviceSize === DeviceSize.Small) {
        return <NotSupported/>;
    }

    return (
        <>
            <h1>deviceSize: {deviceSize}</h1>
            <h1>deviceIsMobile: {deviceIsMobile.toString()}</h1>
            <h1>loading: {loading.toString()}</h1>
            <h1>error: {error}</h1>
            <h1>message: {message}</h1>
            <h1>authorized: {authorized.toString()}</h1>
            <button
                className="btn btn-primary bg-red-500 px-6 py-2"
                onClick={clear}
            >
                logout
            </button>

            {!authorized && <AuthorizationPage/>}

            <ErrorMessage/>
            <Message/>
        </>
    )
}

export default App
