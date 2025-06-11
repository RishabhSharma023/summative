import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import { useNavigate } from "react-router-dom";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [preferences, setPreferences] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const navigate = useNavigate();

    // Load cart from local storage when user changes
    useEffect(() => {
        if (user) {
            const storedCart = localStorage.getItem(`cart-${user.uid}`);
            if (storedCart) {
                setCart(JSON.parse(storedCart));
            }

            // Load user preferences and purchases from Firestore
            const loadUserData = async () => {
                const userDoc = await getDoc(doc(firestore, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setPreferences(data.preferences || null);
                    setPurchases(data.purchases || []);
                }
            };
            loadUserData();
        }
    }, [user]);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        if (user && cart) {
            localStorage.setItem(`cart-${user.uid}`, JSON.stringify(cart));
        }
    }, [cart, user]);

    // Handle Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (!currentUser) {
                setCart([]);
                setPreferences(null);
                setPurchases([]);
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem(`cart-${user.uid}`);
            navigate('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const updatePreferences = async (newPreferences) => {
        if (!user) return;
        setPreferences(newPreferences);
        await setDoc(doc(firestore, "users", user.uid), {
            preferences: newPreferences,
            purchases: purchases
        }, { merge: true });
    };

    const addToCart = (movie) => {
        if (purchases.some(p => p.id === movie.id)) {
            alert("You already own this movie!");
            return;
        }
        if (!cart.some(item => item.id === movie.id)) {
            setCart([...cart, movie]);
        }
    };

    const removeFromCart = (movieId) => {
        setCart(cart.filter(item => item.id !== movieId));
    };

    const checkout = async () => {
        if (!user || cart.length === 0) return;
        
        // Add cart items to purchases in Firestore
        const newPurchases = [...purchases, ...cart];
        await setDoc(doc(firestore, "users", user.uid), {
            preferences: preferences,
            purchases: newPurchases
        }, { merge: true });

        setPurchases(newPurchases);
        setCart([]);
        localStorage.removeItem(`cart-${user.uid}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <StoreContext.Provider value={{
            user,
            cart,
            preferences,
            purchases,
            addToCart,
            removeFromCart,
            checkout,
            updatePreferences,
            logout
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStoreContext = () => useContext(StoreContext);