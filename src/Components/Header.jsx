import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../Contexts/UserContext.jsx';

function Header() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
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
        localStorage.removeItem("isLoggedIn");
        navigate("/");
    }

    function handleBlur(event) {
        if (searchInputRef.current && !searchInputRef.current.contains(event.relatedTarget)) {
            setSearchQuery(""); 
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