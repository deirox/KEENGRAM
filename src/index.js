import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {createBrowserRouter, RouterProvider,} from "react-router-dom";

import "./firebase";

import NoAccesPage from "./Pages/NoAccessPage";
import EditProfilePage from "./Pages/EditProfilePage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import MusicPage from "./Pages/MusicPage";
// import ReelsPage from "./Pages/ReelsPage";
import SignUpPage from "./Pages/SignUpPage";
import MainPage from "./Pages/MainPage";
import ErrorPage from "./Pages/ErrorPage";

const dayjs = require("dayjs");
require("dayjs/locale/ru");
dayjs.locale("ru");

const root = ReactDOM.createRoot(document.getElementById("root"));
const router = createBrowserRouter([
    {
        path: "",
        element: <App/>,
        errorElement: <NoAccesPage/>,
        children: [
            {
                path: "",
                element: <MainPage/>,
            },
            {
                path: ":userNickname",
                element: <ProfilePage/>,
            },
            {
                path: "audios",
                element: <MusicPage/>,
                action: ()=>{

                }
            },
            {
                path: "accounts",
                children: [
                    {
                        path: "login",
                        element: <LoginPage/>,
                    },
                    {
                        path: "emailsignup",
                        element: <SignUpPage/>,
                    },
                    {
                        path: "edit",
                        element: <EditProfilePage/>,
                    },
                ],
            },
        ],

    },
    {path: "accounts/error", element: <ErrorPage/>}
]);
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

