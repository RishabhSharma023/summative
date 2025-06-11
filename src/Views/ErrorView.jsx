import React from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorView.css";

function ErrorView() {
    const navigate = useNavigate();

    return (
        <div className="error-view">
            <h1 className="error-title">404 - Page Not Found</h1>
            <p className="error-message">The page you are looking for does not exist.</p>
            <button className="error-button" onClick={() => navigate("/")}>
                Go Back to Home
            </button>
        </div>
    );
}

export default ErrorView;