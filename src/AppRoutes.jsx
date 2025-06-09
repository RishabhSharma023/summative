import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import LoginView from './views/LoginView';
import AuthenticatedView from './views/AuthenticatedView';
import HomeView from './views/HomeView';
import RegisterView from './views/RegisterView';
import ProtectedRoutes from './utils/ProtectedRoutes';
import { useStoreContext } from './context';

export default function AppRoutes() {
  const { user } = useStoreContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname === '/login') {
      navigate('/authenticated');
    }
  }, [user, location, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/login" element={<LoginView />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/authenticated" element={<AuthenticatedView />} />
      </Route>
    </Routes>
  );
}