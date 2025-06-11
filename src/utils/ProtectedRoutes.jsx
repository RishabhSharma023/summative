import { Navigate, Outlet } from "react-router-dom";
import { useStoreContext } from "../Contexts";

function ProtectedRoutes() {
    const { user } = useStoreContext();
    
    return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;