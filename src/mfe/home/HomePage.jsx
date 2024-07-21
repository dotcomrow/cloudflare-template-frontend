import React, { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { displayError } from '../../common/utilities/functions';
import { getDarkMode } from '../../common/store/slices/user/userSlice';
import Button from 'dtk/Button';
import { H3, H2, H1, Subtitle } from 'dtk/Typography';
import { useSelector } from "react-redux";
import axios from "axios";

export default function HomePage() {
    const [darkMode, setDarkMode] = useState(false);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", ({ matches }) => {
                setDarkMode(getDarkMode(user));
            });
    }, []);

    useEffect(() => {
        setDarkMode(getDarkMode(user))
    }, [user])

    return (
        <ErrorBoundary FallbackComponent={displayError}>
            <Suspense fallback={<div>Loading...</div>}>
                <div class="container">
                    <div class="row pt-5"><H1 darkMode={darkMode}>Welcome!</H1></div>
                    <div class="row align-items-center pt-2 ps-2 pe-2 pb-2">
                        <div class="col-6">
                            <H2 darkMode={darkMode}>Home Page</H2>
                            <Subtitle>Sub title</Subtitle>
                            <Button>Click me</Button>
                        </div>
                        <div class="col-6">
                            <img src='cloud_computing.svg' alt="cloud computing image" width="100%" height="50%"/>
                        </div>
                    </div>
                </div>
            </Suspense>
        </ErrorBoundary>
    )
};