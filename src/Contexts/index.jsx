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
    const navigate = useNavigate();    // Load cart and user data from local storage and Firestore
    useEffect(() => {
        if (user?.uid) {
            // Load cart from local storage
            const storedCart = localStorage.getItem(`cart-${user.uid}`);
            if (storedCart) {
                setCart(JSON.parse(storedCart));
            }

            // Load user data from Firestore
            const loadUserData = async () => {
                try {
                    const userRef = doc(firestore, "users", user.uid);
                    const userDoc = await getDoc(userRef);
                    
                    if (!userDoc.exists()) {
                        // Initialize user document with proper array structure
                        const initialData = {
                            firstName: user.displayName?.split(" ")[0] || "",
                            lastName: user.displayName?.split(" ")[1] || "",
                            email: user.email,
                            selectedGenres: [],  // Ensure this is an array
                            purchases: [],       // Ensure this is an array
                            authProvider: user.providerData[0]?.providerId || "email"
                        };
                        await setDoc(userRef, initialData);
                        setUser(prevUser => ({
                            ...prevUser,
                            ...initialData
                        }));
                        setPreferences({
                            selectedGenres: []
                        });
                        setPurchases([]);
                    } else {
                        const data = userDoc.data();
                        // Ensure arrays are handled properly
                        const selectedGenres = Array.isArray(data.selectedGenres) ? data.selectedGenres : [];
                        const purchases = Array.isArray(data.purchases) ? data.purchases : [];
                        
                        setUser(prevUser => ({
                            ...prevUser,
                            ...data,
                            selectedGenres
                        }));
                        setPreferences({
                            selectedGenres
                        });
                        setPurchases(purchases);
                    }
                } catch (error) {
                    console.error("Error loading user data:", error);
                }
            };
            loadUserData();
        }
    }, [user?.uid]);

    // Save cart to local storage
    useEffect(() => {
        if (user?.uid && cart) {
            localStorage.setItem(`cart-${user.uid}`, JSON.stringify(cart));
        }
    }, [cart, user]);

    // Handle auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (!currentUser) {
                setCart([]);
                setPreferences(null);
                setPurchases([]);
                localStorage.removeItem("isLoggedIn");
            } else {
                localStorage.setItem("isLoggedIn", "true");
            }
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem(`cart-${user?.uid}`);
            localStorage.removeItem("isLoggedIn");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };    const updatePreferences = async (newPreferences) => {
        if (!user?.uid) throw new Error("Must be logged in to update preferences");
        
        try {
            const userRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userRef);
            
            // Ensure arrays are properly handled
            const selectedGenres = Array.isArray(newPreferences.selectedGenres) ? newPreferences.selectedGenres : [];
            
            if (!userDoc.exists()) {
                // Initialize the document if it doesn't exist
                await setDoc(userRef, {
                    firstName: user.displayName?.split(" ")[0] || "",
                    lastName: user.displayName?.split(" ")[1] || "",
                    email: user.email,
                    selectedGenres,
                    purchases: [], // Initialize empty purchases array
                    authProvider: user.providerData[0]?.providerId || "email"
                });
            } else {
                // Update existing document
                const currentData = userDoc.data();
                await setDoc(userRef, {
                    ...currentData,
                    selectedGenres
                }, { merge: true }); // Use merge to preserve other fields
            }

            // Update local state
            setPreferences({ selectedGenres });
            setUser(prevUser => ({
                ...prevUser,
                selectedGenres
            }));
            
            return "Settings updated successfully!";
        } catch (error) {
            console.error("Error updating preferences:", error);
            throw new Error("Failed to update your preferences. Please try again.");
        }
    };

    const addToCart = (movie) => {
        if (!user) {
            alert("Please log in to add items to cart");
            return;
        }
        
        // Check if movie is already in purchases
        if (purchases && purchases.some(p => p.id === movie.id)) {
            alert("You already own this movie!");
            return;
        }
        
        // Check if movie is already in cart
        if (!cart.some(item => item.id === movie.id)) {
            setCart(prevCart => [...prevCart, movie]);
        } else {
            alert("This movie is already in your cart!");
        }
    };

    const removeFromCart = (movieId) => {
        setCart(cart.filter(item => item.id !== movieId));
    };    const checkout = async () => {
        if (!user?.uid) {
            throw new Error("Must be logged in to checkout");
        }

        if (cart.length === 0) {
            throw new Error("Cart is empty");
        }

        try {
            const userRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data() || { purchases: [] };
            
            // Add current cart items to purchases
            const newPurchases = [...(userData.purchases || []), ...cart];
            
            // Update the document with merge option
            await setDoc(userRef, {
                purchases: newPurchases,
                email: user.email,
                firstName: user.displayName?.split(" ")[0] || "",
                lastName: user.displayName?.split(" ")[1] || "",
                selectedGenres: userData.selectedGenres || [],
                authProvider: user.providerData[0]?.providerId || "email"
            }, { merge: true });
            
            // Update local state
            setPurchases(newPurchases);
            setCart([]); // Clear cart
            localStorage.removeItem(`cart-${user.uid}`); // Clear cart from localStorage
            
            return true;
        } catch (error) {
            console.error("Checkout error:", error);
            throw error;
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <StoreContext.Provider value={{
            user,
            loading,
            cart,
            setCart,
            preferences,
            purchases,
            checkout,
            updatePreferences,
            logout,
            addToCart,
            removeFromCart
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStoreContext = () => useContext(StoreContext);