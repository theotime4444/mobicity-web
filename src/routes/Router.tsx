import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login.tsx";
import UserTable from "../components/pages/UserTable.tsx";
import MainPage from "../components/MainPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>
    },
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/userTable",
        element: <UserTable/>
    }
]);

export default router;