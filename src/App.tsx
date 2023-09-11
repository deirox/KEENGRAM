import React, {useEffect, useRef} from "react";

import {Outlet, useNavigate, useParams} from "react-router-dom";
import MetaNavigation from "./components/MetaNavigaton";
import styles from "./App.module.css";

import {useUserStore} from "./store/useUserStore";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import LoaderComponent from "./components/LoaderComponent";
import ErrorComponent from "./components/ErrorComponent";


export default function App() {
    const isAuthorizedUserError = useUserStore(
        (state) => state.isAuthorizedUserError
    );

    const isAuthorizedUserLoading = useUserStore(
        (state) => state.isAuthorizedUserLoading
    );

    const getAuthorizedUser = useUserStore((state: any) => state.getAuthorizedUser);
    const setAuthorizedUser = useUserStore((state: any) => state.setAuthorizedUser);

    const effectRun = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in

                setAuthorizedUser(user);
                // navigate("/");
                getAuthorizedUser(user);
            } else {
                setAuthorizedUser({});
                navigate("/accounts/login");
                // User is signed out
            }
            return user;
        });
        if (!effectRun.current) {
            return () => {
                effectRun.current = true;
            };
        }
    }, [navigate, getAuthorizedUser, setAuthorizedUser]);

    return (
        <div className={`${styles.app__wrapper}`}>
            {isAuthorizedUserLoading ? (
                isAuthorizedUserError ? (
                    <ErrorComponent/>
                ) : (
                    <LoaderComponent/>
                )
            ) : (
                <>
                    <MetaNavigation/>
                    <Outlet/>
                    {/*{!Object.keys(params).length ? <MainPage /> : <Outlet />}*/}
                    {/*<MainPage />*/}
                </>
            )}
        </div>
    );
}


