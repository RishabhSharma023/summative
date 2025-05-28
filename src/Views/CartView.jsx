import "./CartView.css";
import { useContext, useState } from "react";
import { UserContext } from "../Contexts/UserContext.jsx";
import { useNavigate } from "react-router-dom";

function CartView() {
    const { cart, removeFromCart } = useContext(UserContext);
    const navigate = useNavigate();
    const itemsPerPage = 10; // 5 columns x 2 rows
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate total pages based on the number of items in the cart
    const totalPages = Math.ceil(cart.length / itemsPerPage);

    // Ensure the grid is always filled by slicing the cart array
    const paginatedCart = cart.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="cart-container">
            <h1 className="cart-title">Your Cart</h1>
            {cart.length > 0 ? (
                <>
                    <div className="cart-grid">
                        {paginatedCart.map((movie) => (
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
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pagination-container">
                        <button
                            className="pagination-button"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        <span className="pagination-info">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="pagination-button"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p className="empty-cart-message">Your cart is empty.</p>
            )}
            <button className="back-button" onClick={() => navigate(-1)}>
                Back
            </button>
        </div>
    );
}

export default CartView;