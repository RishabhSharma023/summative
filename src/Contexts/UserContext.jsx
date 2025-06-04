import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null); 
    const [cart, setCart] = useState([]); 

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
            }}
        >
            {children}
        </UserContext.Provider>
    );
}