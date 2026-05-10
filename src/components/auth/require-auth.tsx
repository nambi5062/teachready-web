import { Navigate, Outlet } from "react-router";
import { PreferencesModal } from "@/components/onboarding/preferences-modal";
import { useAuth } from "@/hooks/use-auth";

export const RequireAuth = () => {
    const { isAuthenticated, isProfileComplete } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Outlet />
            <PreferencesModal isOpen={!isProfileComplete} />
        </>
    );
};
