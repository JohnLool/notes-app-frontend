import {useSelector} from "react-redux";
import {RootState} from "../../utils/store.ts";

const Loading = () => {
    const loading = useSelector((state: RootState) => state.app.loading);

    if (!loading) return null;

    return (
        <div className="flex items-center justify-center h-screen bg-black/50 fixed inset-0 z-50 backdrop-blur-xs">
            <div className="text-center">
                <div
                    className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-solid border-opacity-50"></div>
                <p className="mt-4 text-white text-lg">Loading</p>
            </div>
        </div>
    );
};

export default Loading;
