import useDevice from "../hooks/useDevice.ts";
import {useSelector} from "react-redux";
import {RootState} from "../utils/store.ts";

function App() {
    useDevice();

    const deviceSize = useSelector((state: RootState) => state.device.size);
    const deviceIsMobile = useSelector((state: RootState) => state.device.isMobile);
    const loading = useSelector((state: RootState) => state.app.loading);
    const error = useSelector((state: RootState) => state.app.error);
    const message = useSelector((state: RootState) => state.app.message);

    return (
        <>
            <h1>{deviceSize}</h1>
            <h1>{deviceIsMobile.toString()}</h1>
            <h1>{loading.toString()}</h1>
            <h1>{error}</h1>
            <h1>{message}</h1>
        </>
    )
}

export default App
