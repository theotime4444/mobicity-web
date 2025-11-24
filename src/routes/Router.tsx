import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login.tsx";
import Tables from "../pages/Tables.tsx";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/tables",
        element: <Tables/>
    }
]);

export default router;