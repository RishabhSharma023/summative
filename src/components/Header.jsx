import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useStoreContext } from '../Contexts';

function Header() {
    const navigate = useNavigate();
    const { user, logout } = useStoreContext();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef(null);

    // Update the URL dynamically as the user types
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery.trim() && !window.location.pathname.includes("/movies/details")) {
                navigate(`/movies/search?query=${searchQuery}`);
            }
        }, 500); // 500ms debounce time

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery, navigate]);

    function handleSignOut() {
        logout();
        navigate("/");
    }

    function handleBlur(event) {
        if (searchInputRef.current && !searchInputRef.current.contains(event.relatedTarget)) {
            setSearchQuery(""); // Clear the search query when clicking outside
        }
    }

    return (
        <header className="header">
            <div className="logo-container">
                <div className="logo">Amazin' Prime Video</div>
                <img className="logoImg" src="/amazingprimeVid.png" alt="Logo" />
            </div>
            <div className="login-container">
                {isLoggedIn ? (
                    <>
                        <span className="welcome-message">Hello {user?.firstName}!</span>
                        <form className="search-form" ref={searchInputRef}>
                            <input
                                type="text"
                                className="search-box"
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onBlur={handleBlur}
                            />
                        </form>
                        <button className="button" onClick={() => navigate('/cart')}>Cart</button>
                        <button className="button" onClick={() => navigate('/settings')}>Settings</button>
                        <button className="button" onClick={handleSignOut}>Logout</button>
                    </>
                ) : (
                    <>
                        <button className="button" onClick={() => navigate('/login')}>Login</button>
                        <button className="button" onClick={() => navigate('/register')}>Register</button>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;