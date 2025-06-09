import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Map } from "immutable";
import { auth } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(Map());
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                if (location.pathname === '/login' || location.pathname === '/register') {
                    navigate('/authenticated');
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
    }, [navigate, location]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <StoreContext.Provider value={{ user, setUser, cart, setCart }}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}