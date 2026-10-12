import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Illustrations from "../pages/Illustrations/Illustrations";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/Illustrations',
        element: <Illustrations/>
    }
]);