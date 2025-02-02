import {useState} from "react";
import {AppDispatch} from "../../utils/store";
import {useDispatch} from "react-redux";
import {setAppError, setAppLoading, setAppMessage} from "../../slices/appSlice";
import Cookies from "js-cookie";
import {setAccountAuthorized} from "../../slices/accountSlice.ts";
import {api} from "../../utils/api.ts";

const loginUser = async (email: string, password: string) => {
    return api.post('/auth/token', new URLSearchParams({ username: email, password }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
};

const registerUser = async (username: string, email: string, password: string) => {
    return api.post('/users', { username, email, password });
};

const Login = () => {
    const dispatch: AppDispatch = useDispatch();

    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [register, setRegister] = useState<boolean>(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!email || !password) {
            dispatch(setAppError('field "email" and "password" is required'))
            return;
        }

        dispatch(setAppLoading(true));
        try {
            const response = await loginUser(email, password);
            const token = response.data.access_token;
            Cookies.set('token', token, {expires: 1});
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            dispatch(setAccountAuthorized(true));
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                dispatch(setAppError(error.message));
            } else {
                dispatch(setAppError("An unknown error occurred"));
            }
            Cookies.remove('token');
            delete api.defaults.headers.common['Authorization'];
            dispatch(setAccountAuthorized(false));
        } finally {
            dispatch(setAppLoading(false));
        }
    };

    const handleSubmitRegister = async (e: any) => {
        e.preventDefault();
        if (!username || !email || !password) {
            dispatch(setAppError('fields "username", "email" and "password" is required'))
            return;
        }

        dispatch(setAppLoading(true));
        try {
            const response = await registerUser(username, email, password);
            console.log(response);
            dispatch(setAppMessage('Successfully registered!'));
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                dispatch(setAppError(error.message));
            } else {
                dispatch(setAppError("An unknown error occurred"));
            }
        } finally {
            dispatch(setAppLoading(false));
        }
    };


    if (register) {
        return (
            <div className="fixed z-50 inset-0 flex items-center justify-center h-screen bg-white">
                <div className="p-6 w-full max-w-sm">
                    <h2 className="text-2xl font-bold text-center mb-6">Registration</h2>
                    <form onSubmit={handleSubmitRegister} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="username"
                                id="username"
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@mail.com"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                        >
                            Submit
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-4">
                        <button className="text-blue-500 hover:underline" onClick={() => setRegister(false)}>
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center h-screen bg-white">
            <div className="p-6 w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Authorization</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                    >
                        Submit
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    <button className="text-blue-500 hover:underline" onClick={() => setRegister(true)}>
                        Create new account
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
