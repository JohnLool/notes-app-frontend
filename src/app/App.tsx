import useDevice from "../hooks/useDevice.ts";
import {useSelector} from "react-redux";
import {RootState} from "../utils/store.ts";

function App() {
    useDevice();

    const deviceSize = useSelector((state: RootState) => state.device.size);
    const deviceIsMobile = useSelector((state: RootState) => state.device.isMobile);

    return (
        <>
            <h1>{deviceSize}</h1>
            <h1>{deviceIsMobile.toString()}</h1>
        </>
    )
}

export default App
