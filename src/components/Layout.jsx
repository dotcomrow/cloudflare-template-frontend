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
import { LOADER_KEY } from "../common/utilities/constants";
import { WifiLoader } from "react-awesome-loaders-py3";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, getDarkMode } from "../common/store/slices/user/userSlice";
import { H2 } from "dtk/Typography";
import axios from 'axios';

import ProfilePage from '../mfe/profile/ProfilePage';
import HomePage from '../mfe/home/HomePage';

const Main = function Layout() {

    const [pageLoader, setPageLoader] = useState(true);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [darkMode, setDarkMode] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setTimeout(async () => {
            // login not completed in 10 seconds...something not right
            if (loggedIn == false) {
                await axios.post('nodejs-cloudflare-logging-service',
                    {
                        "severity": "ERROR",
                        "payload": {
                            message: "Login not completed in 10 seconds",
                            user: user
                        }
                    })
                dispatch({ type: "LOGOUT" });
            }
        }, 10 * 1000);
        if (user.access_token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${user.access_token}`;
        }
        if (user && user.loading && user.loading == 'complete') {
            setLoggedIn(true);
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
                displayError({ error: err })
            });
        }
    }, [])

    useEffect(() => {
        if (user.access_token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${user.access_token}`;
        }
        if (user && (user.loading) && (user.loading == 'complete') && (user.user_settings) && (user.user_settings.loading) && (user.user_settings.loading == 'complete')) {
            setLoggedIn(true);
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
    }, [user])

    const Loader = () => {
        return (
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
            </div>
        )
    }

    return (pageLoader) ? (
        <div id="loaderParent" onTransitionEnd={() => {
            setPageLoader(false);
        }}><Loader /></div>)
        : (
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