import React from 'react'; 

const Taskbar = ({toggleLoading, checkLoading}) => {
    return (<div className="taskbar">
        <div className="taskbar__container">
            <div className="taskbar__logo">
                <img src="https://via.placeholder.com/150" alt="logo" />
            </div>
            <div className="taskbar__navigation">
                <ul>
                    <li><a href="/">taskbar link</a></li>
                </ul>
            </div>
        </div>
    </div>);
}

export default Taskbar;