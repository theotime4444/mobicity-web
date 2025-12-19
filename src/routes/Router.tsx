import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";

const Login = lazy(() => import("../components/Login"));
const MainPage = lazy(() => import("../components/MainPage"));
const UserTable = lazy(() => import("../components/pages/UserTable"));
const UserForm = lazy(() => import("../components/pages/UserForm"));
const VehicleTable = lazy(() => import("../components/pages/VehicleTable"));
const VehicleForm = lazy(() => import("../components/pages/VehicleForm"));
const CategoryTable = lazy(() => import("../components/pages/CategoryTable"));
const CategoryForm = lazy(() => import("../components/pages/CategoryForm"));
const LocationTable = lazy(() => import("../components/pages/LocationTable"));
const LocationForm = lazy(() => import("../components/pages/LocationForm"));

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <MainPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/users",
        element: (
            <ProtectedRoute>
                <UserTable />
            </ProtectedRoute>
        ),
    },
    {
        path: "/users/new",
        element: (
            <ProtectedRoute>
                <UserForm />
            </ProtectedRoute>
        ),
    },
    {
        path: "/users/:id/edit",
        element: (
            <ProtectedRoute>
                <UserForm />
            </ProtectedRoute>
        ),
    },
    {
        path: "/vehicles",
        element: (
            <ProtectedRoute>
                <VehicleTable />
            </ProtectedRoute>
        ),
    },
    {
        path: "/vehicles/new",
        element: (
            <ProtectedRoute>
                <VehicleForm />
            </ProtectedRoute>
        ),
    },
    {
        path: "/vehicles/:id/edit",
        element: (
            <ProtectedRoute>
                <VehicleForm />
            </ProtectedRoute>
        ),
    },
    {
        path: "/categories",
        element: (
            <ProtectedRoute>
                <CategoryTable />
            </ProtectedRoute>
        ),
    },
    {
        path: "/categories/new",
        element: (
            <ProtectedRoute>
                <CategoryForm />
            </ProtectedRoute>
        ),
    },
    {
        path: "/categories/:id/edit",
        element: (
            <ProtectedRoute>
                <CategoryForm />
            </ProtectedRoute>
        ),
    },
    {
        path: "/locations",
        element: (
            <ProtectedRoute>
                <LocationTable />
            </ProtectedRoute>
        ),
    },
    {
        path: "/locations/new",
        element: (
            <ProtectedRoute>
                <LocationForm />
            </ProtectedRoute>
        ),
    },
    {
        path: "/locations/:id/edit",
        element: (
            <ProtectedRoute>
                <LocationForm />
            </ProtectedRoute>
        ),
    },
]);

export default router;