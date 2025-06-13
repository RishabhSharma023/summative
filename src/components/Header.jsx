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

    // Helper function to get user's display name
    const getUserDisplayName = () => {
        if (user?.firstName) {
            return user.firstName;
        } else if (user?.displayName) {
            return user.displayName.split(" ")[0];
        }
        return "User";
    };

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
    }, [searchQuery, navigate]);    async function handleSignOut() {
        try {
            await logout();
            localStorage.removeItem("isLoggedIn");
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }

    function handleBlur(event) {
        if (searchInputRef.current && !searchInputRef.current.contains(event.relatedTarget)) {
            setSearchQuery(""); // Clear the search query when clicking outside
        }
    }

    return (
        <header className="header">
            <Link to="/" className="logo-container">
                <div className="logo">Amazin' Prime Video</div>
                <img className="logoImg" src="/amazingprimeVid.png" alt="Logo" />
            </Link>
            <div className="login-container">
                {isLoggedIn ? (
                    <>
                        <div className="search-container">
                            <span className="welcome-message">Hello {getUserDisplayName()}!</span>
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
                        </div>
                        <div className="buttons-container">
                            <button className="button" onClick={() => navigate('/cart')}>Cart</button>
                            <button className="button" onClick={() => navigate('/settings')}>Settings</button>
                            <button className="button" onClick={handleSignOut}>Logout</button>
                        </div>
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