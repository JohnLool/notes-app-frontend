import useDevice from "../hooks/useDevice.ts";
import {useSelector} from "react-redux";
import {RootState} from "../utils/store.ts";
import {useAccount} from "../hooks/useAccount.ts";
import NotSupported from "./pages/NotSupported.tsx";
import {DeviceSize} from "../slices/deviceSlice.ts";
import AuthorizationPage from "./pages/AuthorizationPage.tsx";
import ErrorMessage from "./components/ErrorMessage.tsx";
import Message from "./components/Message.tsx";
import Loading from "./components/Loading.tsx";
import { ReactNode } from "react";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import PageNotes from "./pages/PageNotes.tsx";
import PageUsers from "./pages/PageUsers.tsx";
import PageMe from "./pages/PageMe.tsx";
import Page from "./pages/Page.tsx";

export interface RoutePageInterface {
    path: string;
    element: ReactNode;
    title: string;
}

export const routePages: RoutePageInterface[] = [
    {path: '/notes', element: <Page element={<PageNotes/>}/>, title: "Notes"},
    {path: '/users', element: <Page element={<PageUsers/>}/>, title: "Users"},
    {path: '/me', element: <Page element={<PageMe/>}/>, title: "Me"},
];

const router = createBrowserRouter([
    {path: "*", element: <Navigate to="/notes"/>},
    ...routePages.map(page => ({
        path: page.path,
        element: page.element
    }))
]);


function App() {
    useDevice();
    useAccount();

    const deviceSize = useSelector((state: RootState) => state.device.size);
    const authorized = useSelector((state: RootState) => state.account.authorized);

    if (deviceSize === DeviceSize.Small) {
        return <NotSupported/>;
    }

    return (
        <>
            {!authorized ? <AuthorizationPage/> : <RouterProvider router={router}/>}

            <ErrorMessage/>
            <Message/>

            <Loading/>
        </>
    )
}

export default App
