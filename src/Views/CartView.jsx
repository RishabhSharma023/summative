import "./CartView.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../Contexts";
import Header from "../Components/Header";

function CartView() {
    const { cart, removeFromCart, checkout } = useStoreContext();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleCheckout = async () => {
        if (cart.length === 0) {
            setError("Your cart is empty");
            return;
        }

        setIsProcessing(true);
        setError("");
        
        try {
            await checkout();
            setCheckoutSuccess(true);
            setError("");
            // Show success message for 2 seconds before redirecting
            setTimeout(() => {
                navigate('/settings');
            }, 2000);
        } catch (error) {
            console.error("Checkout error:", error);
            setError(error.message || "Error processing your purchase. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="cart-container">
                <h1 className="cart-title">Your Cart</h1>
                {checkoutSuccess && (
                    <p className="success-message">
                        Thank you for your purchase! Redirecting to your library...
                    </p>
                )}
                {error && <p className="error-message">{error}</p>}
                
                {cart.length > 0 ? (
                    <>
                        <div className="cart-grid">
                            {cart.map((movie) => (
                                <div key={movie.id} className="cart-item">
                                    <img
                                        className="cart-item-poster"
                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                    <div className="cart-item-details">
                                        <h2 className="cart-item-title">{movie.title}</h2>
                                        <button
                                            className="remove-button"
                                            onClick={() => removeFromCart(movie.id)}
                                            disabled={isProcessing}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="checkout-section">
                            <p className="cart-total">Total Items: {cart.length}</p>
                            <button 
                                className={`checkout-button ${isProcessing ? 'processing' : ''}`}
                                onClick={handleCheckout}
                                disabled={isProcessing || checkoutSuccess}
                            >
                                {isProcessing ? "Processing..." : "Checkout"}
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="empty-cart-message">Your cart is empty.</p>
                )}
                <button 
                    className="back-button" 
                    onClick={() => navigate(-1)}
                    disabled={isProcessing}
                >
                    Back
                </button>
            </div>
        </div>
    );
}

export default CartView;