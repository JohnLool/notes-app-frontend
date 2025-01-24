import {AppDispatch, RootState} from "../../utils/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {setAppError} from "../../slices/appSlice.ts";

const ErrorMessage = () => {
    const dispatch: AppDispatch = useDispatch();

    const error = useSelector((state: RootState) => state.app.error);

    if (error.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-lg font-bold">Error</h2>
                    <button
                        onClick={() => dispatch(setAppError(''))}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-4">
                    <p>{error}</p>
                </div>
                <div className="flex justify-end p-4">
                    <button
                        onClick={() => dispatch(setAppError(''))}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;
