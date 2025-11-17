import { RouterProvider } from "react-router-dom";
import router from "./routes/Router.jsx";
import './App.scss'

export default function App(){
    return <RouterProvider router={router}/>    
}