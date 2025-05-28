import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null); 
    const [cart, setCart] = useState([]); 
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);

    function registerUser(newUser) {
        setRegisteredUsers((prevUsers) => [...prevUsers, newUser]);
    }

    function loginUser(email, password) {
        const foundUser = registeredUsers.find(
            (user) => user.email === email && user.password === password
        );
        if (foundUser) {
            setUser(foundUser);
            setLoggedIn(true);
            localStorage.setItem("isLoggedIn", "true");
            return true;
        }
        return false;
    }

    function logoutUser() {
        setUser(null);
        setLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
    }

    function addToCart(movie) {
        setCart((prevCart) => [...prevCart, movie]);
    }

    function removeFromCart(movieId) {
        setCart((prevCart) => prevCart.filter((movie) => movie.id !== movieId));
    }

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                cart,
                addToCart,
                removeFromCart,
                registeredUsers,
                registerUser,
                loginUser,
                logoutUser,
                loggedIn,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}