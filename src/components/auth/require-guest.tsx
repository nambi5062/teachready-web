import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/use-auth";

export const RequireGuest = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
