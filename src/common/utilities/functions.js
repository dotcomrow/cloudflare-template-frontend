import React from "react";

export const displayError = ({ detail, error, title, detailMessage }) => {
  return (
    <div className="col-12 pt-5 pb-5">
      <div className="tile container-fluid col-4 module-container">
        <div className="align-content-center container-fluid">
          <div>
            <h1>{title ? title : "Something went wrong!"}</h1>
            <p>
              {detailMessage ? detailMessage : "We are working hard to fix it....please come back again a bit later"}
            </p>
            <p>{error.message ? "Exception: " + error.message : ""}</p>
            <p>{error.stack ? "Traceback: " + error.stack: ""}</p>
            <p>{detail ? "Detail: " + detail : ""}</p>
            <p>
              Click <a href="#" onClick={
                (e) => {
                  e.preventDefault();
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = "/";
                }
              }>here</a> to return to homepage and try again.
            </p>
          </div>
        </div>
        <img src="error.jpg" alt="error" style={{
          'width':'100%',
          'height':'100%'
        }} />
        <a href="https://www.freepik.com/free-vector/computer-repair-illustration_17714407.htm#query=website%20error&position=49&from_view=keyword&track=ais">
          Image by macrovector
        </a>{" "}
        on Freepik
      </div>
    </div>
  );
};
