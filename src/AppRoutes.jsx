import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import LoginView from './Views/LoginView';
import MoviesView from './Views/MoviesView';
import HomeView from './Views/HomeView';
import RegisterView from './Views/RegisterView';
import DetailView from './Views/DetailView';
import CartView from './Views/CartView';
import SearchView from './Views/SearchView';
import GenreView from './Views/GenreView';
import SettingsView from './Views/SettingsView';
import ErrorView from './Views/ErrorView';
import ProtectedRoutes from './utils/ProtectedRoutes';
import { useStoreContext } from './Contexts';

export default function AppRoutes() {
  const { user } = useStoreContext();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // If user is authenticated and trying to access login/register, redirect to movies
    if (user && (location.pathname === '/login' || location.pathname === '/register')) {
      navigate('/movies');
    }
    // If user is not authenticated and trying to access protected routes, redirect to login
    if (!user && location.pathname.startsWith('/movies')) {
      navigate('/login');
    }
  }, [user, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      
      {/* Auth Routes - Redirect to movies if already logged in */}
      <Route path="/register" element={user ? <Navigate to="/movies" /> : <RegisterView />} />
      <Route path="/login" element={user ? <Navigate to="/movies" /> : <LoginView />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/movies" element={<MoviesView />}>
          <Route path="genre/:genre_id" element={<GenreView />} />
          <Route path="details/:id" element={<DetailView />} />
          <Route path="search" element={<SearchView />} />
        </Route>
        <Route path="/cart" element={<CartView />} />
        <Route path="/settings" element={<SettingsView />} />
      </Route>

      <Route path="*" element={<ErrorView />} />
    </Routes>
  );
}