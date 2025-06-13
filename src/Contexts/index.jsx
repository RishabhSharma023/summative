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

    // Load cart and user data from local storage and Firestore
    useEffect(() => {
        if (user?.uid) {
            const loadData = async () => {
                let retryCount = 0;
                const maxRetries = 3;
                
                while (retryCount < maxRetries) {
                    try {
                        // Load cart from local storage
                        const storedCart = localStorage.getItem(`cart-${user.uid}`);
                        if (storedCart) {
                            try {
                                const parsedCart = JSON.parse(storedCart);
                                setCart(Array.isArray(parsedCart) ? parsedCart : []);
                            } catch (e) {
                                console.error('Error parsing cart:', e);
                                setCart([]);
                            }
                        }

                        // Load user data from Firestore
                        const userRef = doc(firestore, "users", user.uid);
                        const userDoc = await getDoc(userRef);
                        
                        if (!userDoc.exists()) {
                            // Initialize user document with proper array structure
                            const initialData = {
                                firstName: user.displayName?.split(" ")[0] || "",
                                lastName: user.displayName?.split(" ")[1] || "",
                                email: user.email,
                                selectedGenres: [],
                                purchases: [],
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
                            const selectedGenres = Array.isArray(data.selectedGenres) ? data.selectedGenres : [];
                            const userPurchases = Array.isArray(data.purchases) ? data.purchases : [];
                            
                            setUser(prevUser => ({
                                ...prevUser,
                                ...data,
                                selectedGenres
                            }));
                            setPreferences({
                                selectedGenres
                            });
                            setPurchases(userPurchases);
                        }
                        break;
                    } catch (error) {
                        console.error(`Error loading user data (attempt ${retryCount + 1}):`, error);
                        retryCount++;
                        if (retryCount === maxRetries) {
                            setCart([]);
                            setPreferences({ selectedGenres: [] });
                            setPurchases([]);
                            console.error("Failed to load user data after all retries");
                        } else {
                            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
                        }
                    }
                }
            };
            
            loadData();
        }
    }, [user?.uid]);

    useEffect(() => {
        if (user?.uid && cart) {
            localStorage.setItem(`cart-${user.uid}`, JSON.stringify(cart));
        }
    }, [cart, user?.uid]);

    // Handle auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setPreferences(null);
                setPurchases([]);
                setUser(null);
                setCart([]);
                localStorage.removeItem("isLoggedIn");
            } else {
                setUser(currentUser);
                // Load cart from localStorage after user is set
                const storedCart = localStorage.getItem(`cart-${currentUser.uid}`);
                if (storedCart) {
                    try {
                        const parsedCart = JSON.parse(storedCart);
                        setCart(Array.isArray(parsedCart) ? parsedCart : []);
                    } catch (e) {
                        console.error('Error parsing cart:', e);
                        setCart([]);
                    }
                }
                localStorage.setItem("isLoggedIn", "true");
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            const currentUserId = user?.uid;
            if (currentUserId && cart.length > 0) {
                // Save cart before logout
                localStorage.setItem(`cart-${currentUserId}`, JSON.stringify(cart));
            }
            await signOut(auth);
            localStorage.removeItem("isLoggedIn");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };    const updatePreferences = async (newPreferences) => {
        if (!user?.uid) throw new Error("Must be logged in to update preferences");
        
        try {
            const userRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userRef);
            
            // Get current data or initialize with defaults
            const currentData = userDoc.exists() ? userDoc.data() : {
                purchases: [],
                authProvider: user.providerData[0]?.providerId || "email"
            };

            // Prepare update data
            const updateData = {
                ...currentData,
                selectedGenres: newPreferences.selectedGenres || currentData.selectedGenres || [],
                firstName: newPreferences.firstName || currentData.firstName || "",
                lastName: newPreferences.lastName || currentData.lastName || "",
                email: user.email,
                // Only update passwordLength if it's provided in newPreferences
                ...(newPreferences.passwordLength !== undefined && { passwordLength: newPreferences.passwordLength })
            };
            
            // Update Firestore
            await setDoc(userRef, updateData, { merge: true });

            // Update local state
            setPreferences({ selectedGenres: updateData.selectedGenres });
            setUser(prevUser => ({
                ...prevUser,
                ...updateData
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
            const updatedCart = [...cart, movie];
            setCart(updatedCart);
            // Save to localStorage
            localStorage.setItem(`cart-${user.uid}`, JSON.stringify(updatedCart));
        } else {
            alert("This movie is already in your cart!");
        }
    };

    const removeFromCart = (movieId) => {
        const updatedCart = cart.filter(item => item.id !== movieId);
        setCart(updatedCart);
        // Update localStorage
        if (user?.uid) {
            if (updatedCart.length > 0) {
                localStorage.setItem(`cart-${user.uid}`, JSON.stringify(updatedCart));
            } else {
                localStorage.removeItem(`cart-${user.uid}`);
            }
        }
    };

    const checkout = async () => {
        if (!user?.uid) {
            throw new Error("Must be logged in to checkout");
        }

        if (!Array.isArray(cart) || cart.length === 0) {
            throw new Error("Cart is empty");
        }

        try {
            const userRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data() || { purchases: [] };
            
            // Ensure purchases is an array
            const currentPurchases = Array.isArray(userData.purchases) ? userData.purchases : [];
            
            // Filter out any duplicate movies
            const newItems = cart.filter(item => !currentPurchases.some(p => p.id === item.id));
            
            // Create new purchases array
            const newPurchases = [...currentPurchases, ...newItems];

            // Update user document with new purchases
            await setDoc(userRef, {
                ...userData,
                purchases: newPurchases
            }, { merge: true });

            // Update local state
            setPurchases(newPurchases);
            setCart([]); // Clear cart
            localStorage.removeItem(`cart-${user.uid}`); // Clear cart from localStorage
            
            return true;
        } catch (error) {
            console.error("Checkout error:", error);
            throw new Error("Failed to process checkout. Please try again.");
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