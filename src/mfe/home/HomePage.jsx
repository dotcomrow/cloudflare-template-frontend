import React, { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { displayError } from '../../common/utilities/functions';
import { updatePreference, getDarkMode } from '../../common/store/slices/user/userSlice';
import Button from 'dtk/Button';
import { H3, H2, Subtitle } from 'dtk/Typography';
import { useSelector, useDispatch } from "react-redux";
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
                <div>
                    <H2 darkMode={darkMode}>Home Page</H2>
                    <div>
                        <Button onClick={() => {
                            axios.post('/nodejs-cloudflare-logging-service', 
                                { 
                                    "severity": "INFO",
                                    "message":{
                                        "message": "This is a test log message"
                                    }
                                }).then((response) => {
                                console.log(response.data);
                            });
                        }}>Test log</Button>
                    </div>
                </div>
            </Suspense>
        </ErrorBoundary>
    )
};