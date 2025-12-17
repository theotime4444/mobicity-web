import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import router from "./routes/Router";
import LoadingSpinner from "./components/common/LoadingSpinner";
import './App.css';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Suspense fallback={<LoadingSpinner fullScreen message="Chargement de l'application..." />}>
                <RouterProvider router={router} />
            </Suspense>
        </AuthProvider>
    );
};

export default App;