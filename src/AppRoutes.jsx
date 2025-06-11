import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
    if (user && location.pathname === '/login') {
      navigate('/movies');
    }
  }, [user, location, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/login" element={<LoginView />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/movies" element={<MoviesView />} />
        <Route path="/movie/:id" element={<DetailView />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/search" element={<SearchView />} />
        <Route path="/genre/:genre" element={<GenreView />} />
        <Route path="/settings" element={<SettingsView />} />
      </Route>

      <Route path="*" element={<ErrorView />} />
    </Routes>
  );
}