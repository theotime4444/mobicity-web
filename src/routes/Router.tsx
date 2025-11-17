import { createBrowserRouter } from "react-router-dom";
import LoginForm from "../pages/LoginForm.tsx";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginForm/>,
    },
]);

export default router;