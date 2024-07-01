import Modal from 'dtk/Modal';
import { ErrorBoundary } from 'react-error-boundary';
import React, { useState, useEffect, useRef } from 'react';
import { displayError } from '../../common/utilities/functions';
import { useSelector } from "react-redux";
import { logout, getDarkMode } from "../../common/store/slices/user/userSlice";

const TimeoutModal = ({ vars }) => {

    const [open, setOpen] = useState(false);
    const [timer, setTimer] = useState('00:00');
    const Ref = useRef(null);
    const user = useSelector((state) => state.user);
    const [darkMode, setDarkMode] = useState(false);
    const expires_in = useSelector((state) => state.user.expires_in);

    useEffect(() => {
        setDarkMode(getDarkMode(user));
    }, [user]);

    useEffect(() => {
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", ({ matches }) => {
                setDarkMode(getDarkMode(user));
            });
    }, []);

    useEffect(() => {
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            if (!user) {
                clearInterval(id);
                return;
            }
            startTimer();
        }, 1000)
        Ref.current = id;
        async function fetchData() {
            while (true) {
                if (!user) {
                    await new Promise(r => setTimeout(r, 1000));
                    break;
                }
                const session_expires_in = parseInt(user.state) + (parseInt(expires_in) * 1000)
                const now = new Date();
                if (now.getTime() > new Date(session_expires_in).getTime() - (1000 * 60 * 2)) {
                    //show 2 minute modal
                    if (!open) {
                        setOpen(true);
                    }
                }
                // compare the expiry time of the item with the current time
                if (now.getTime() > new Date(session_expires_in).getTime()) {
                    logout();
                }
                await new Promise(r => setTimeout(r, 1000));
            }
        }
        fetchData();
    }, []);

    function getTimeRemaining() {
        const session_expires_in = parseInt(user.state) + (expires_in * 1000)
        const total = new Date(session_expires_in).getTime() - new Date().getTime();
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            total, minutes, seconds
        };
    }

    function startTimer() {
        let { total, minutes, seconds }
            = getTimeRemaining();
        if (total >= 0) {

            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the beginning of the variable
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
    }

    return (
        <ErrorBoundary FallbackComponent={displayError}>
            <Modal
                darkMode={darkMode}
                open={open}
                setOpen={setOpen}
                size="small"
                shouldClose={() => { false }}
                style={{ "zIndex": 10 }}
            >
                <div className="modal-header text-center"><h2>Session Expires In:</h2></div>
                <div className="modal-body">
                    <div className="row">
                        <div className="text-center">
                            <h1 className="text-danger">{timer}</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="text-center">

                        </div>
                    </div>
                </div>
            </Modal>
        </ErrorBoundary>
    );
}

export default TimeoutModal;