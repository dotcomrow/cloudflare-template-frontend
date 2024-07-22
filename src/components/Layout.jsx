import React, { useEffect, useState } from 'react';
import {
    HashRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import "../style.scss";
import { ErrorBoundary } from "react-error-boundary";
import SessionTimeout from './modals/SessionTimeout';
import Header from "./globalnav/layout/header/header";
import Footer from "./globalnav/layout/footer/footer";
import { BaseStyles } from "dtk/BaseStyles";
import { displayError } from '../common/utilities/functions';
import { LOADER_KEY, ERROR } from "../common/utilities/constants";
import { WifiLoader } from "react-awesome-loaders-py3";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, getDarkMode } from "../common/store/slices/user/userSlice";
import { H2 } from "dtk/Typography";
import axios from 'axios';

import ProfilePage from '../mfe/profile/ProfilePage';
import HomePage from '../mfe/home/HomePage';

const Main = function Layout() {

    const [pageLoader, setPageLoader] = useState(true);
    const [siteError, setSiteError] = useState(false);
    const [siteException, setSiteException] = useState({});
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [darkMode, setDarkMode] = useState(false);

    const initializeAxios = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.access_token}`;

        axios.interceptors.request.use(request => {
            // console.log(request);
            // Edit request config
            return request;
        }, error => {
            try {
                axios.post('/nodejs-cloudflare-logging-service',
                    {
                        "severity": "ERROR",
                        "payload": {
                            error
                        }
                    })
            } catch (error) {
                console.log(error);
            }
        });

        axios.interceptors.response.use(response => {
            // console.log(response);
            // Edit response config
            return response;
        }, error => {
            try {
                axios.post('/nodejs-cloudflare-logging-service',
                    {
                        "severity": "ERROR",
                        "payload": {
                            error
                        }
                    })
            } catch (error) {
                console.log(error);
            }
        });
    }

    const displaySiteError = (errorObj) => {
        setPageLoader(false);
        setSiteException({
            detail: errorObj.error, error: {
                message: errorObj.message,
                stack: errorObj.stack
            },
            title: errorObj.title,
            detailMessage: errorObj.detailMessage
        });
        setSiteError(true);
    }

    useEffect(() => {
        const errorTest = () => {
            if (localStorage.getItem(ERROR)) {
                var e = JSON.parse(localStorage.getItem(ERROR));
                displaySiteError({
                    error: e.error,
                    stack: null,
                    message: null,
                    title: "Login Error",
                    detailMessage: "Authentication is required.  Please choose an account to continue."
                });
                localStorage.removeItem(ERROR);
            } else {
                setTimeout(() => {
                    errorTest();
                }, 1000);
            }
        }
        setTimeout(() => {
            errorTest();
        }, 1000);
    }, [])


    useEffect(() => {
        if (user.access_token) {
            initializeAxios();
        }
        if (user && (user.loading) && (user.loading == 'complete') && (user.user_settings) && (user.user_settings.loading) && (user.user_settings.loading == 'complete')) {
            var now = new Date().getTime();
            if (
                now >
                new Date(
                    parseInt(user.state) +
                    parseInt(user.expires_in) * 1000
                ).getTime()
            ) {
                dispatch({ type: "LOGOUT" });
            }
        } else {
            dispatch(loginUser()).catch((err) => {
                var e = JSON.parse(localStorage.getItem(ERROR));
                displaySiteError({
                    error: "Error",
                    stack: err,
                    message: null,
                    title: "Something went wrong!",
                    detailMessage: "An error occurred during authentication, please try again."
                });
                localStorage.removeItem(ERROR);
            });
        }
    }, [])

    useEffect(() => {
        if (user.access_token) {
            initializeAxios();
        }
        if (user && (user.loading) && (user.loading == 'complete') && (user.user_settings) && (user.user_settings.loading) && (user.user_settings.loading == 'complete')) {
            if (document.getElementById('loaderParent'))
                document.getElementById('loaderParent').classList.add("loader-hide");

            setDarkMode(getDarkMode(user));
            window
                .matchMedia("(prefers-color-scheme: dark)")
                .addEventListener("change", ({ matches }) => {
                    setDarkMode(getDarkMode(user));
                    if (getDarkMode(user)) {
                        document.documentElement.setAttribute('data-bs-theme', 'dark');
                    } else {
                        document.documentElement.setAttribute('data-bs-theme', 'light');
                    }
                });
            if (getDarkMode(user)) {
                document.documentElement.setAttribute('data-bs-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-bs-theme', 'light');
            }
        }
        if (localStorage.getItem(ERROR)) {
            var e = JSON.parse(localStorage.getItem(ERROR));
            displaySiteError({
                error: e.error,
                stack: null,
                message: null,
                title: "Login Error",
                detailMessage: "Authentication is required.  Please choose an account to continue."
            });
            localStorage.removeItem(ERROR);
        }
    }, [user])

    const LoaderTxt = () => {
        return (
            <div className="loaderContainerTxt">
                <H2 darkMode={window.matchMedia("(prefers-color-scheme: dark)").matches ? true : false}>
                    {user ?
                        user.loading ?
                            user.loading == 'complete' ?
                                user.user_settings ?
                                    user.user_settings.loading == 'complete' ?
                                        'Loading Complete!' : 'Loading Preferences...'
                                    : 'User Loading Complete, Loading Preferences...'
                                : 'Loading User Data...'
                            : 'Finding User...'
                        : 'Starting login...'}
                </H2>
            </div>
        )
    }

    return (pageLoader) ? (
        <div id="loaderParent" onTransitionEnd={() => {
            setPageLoader(false);
        }}>
            <div className="loader" id={LOADER_KEY} style={{
                "background": window.matchMedia("(prefers-color-scheme: dark)").matches ? "rgba(0,0,0,1)" : "rgba(255,255,255,0.5)",
            }}>
                <div className="loaderContainer">
                    <WifiLoader
                        background={"transparent"}
                        desktopSize={"150px"}
                        mobileSize={"150px"}
                        text={"Wifi Loader"}
                        backColor="lightblue"
                        frontColor="darkblue"
                    />
                </div>
                <LoaderTxt />
            </div>
        </div>)
        : (siteError ? <div id="siteError">{displayError(siteException)}</div> :
            <ErrorBoundary FallbackComponent={displayError}>
                <Router>
                    <Header />
                    <main className="main pt-5 pb-5">
                        <div className="container-fluid" style={{ "height": "100%" }}>
                            <Routes>
                                <Route path="profile" element={
                                    <ProfilePage />
                                }></Route>
                                <Route path="home" element={
                                    <HomePage />
                                }></Route>
                                <Route
                                    path="*"
                                    element={<Navigate to="/home" />}
                                />
                            </Routes>
                        </div>
                    </main>
                    <Footer />
                    <SessionTimeout />
                </Router>
            </ErrorBoundary>
        );
}

export default Main;