import { useCallback } from "react";
import { loginRequest, logoutRequest, signupRequest } from "@/api/auth";
import { useAuthStore, type AuthUser } from "@/store/auth";

interface UseAuthReturn {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
    const user = useAuthStore((s) => s.user);
    const accessToken = useAuthStore((s) => s.accessToken);

    const login = useCallback(async (email: string, password: string) => {
        const session = await loginRequest(email, password);
        useAuthStore.getState().setSession(session);
    }, []);

    const signup = useCallback(async (email: string, password: string) => {
        const session = await signupRequest(email, password);
        useAuthStore.getState().setSession(session);
    }, []);

    const logout = useCallback(async () => {
        const { refreshToken } = useAuthStore.getState();
        if (refreshToken) {
            try {
                await logoutRequest(refreshToken);
            } catch {
                // Server may have already revoked; ignore.
            }
        }
        useAuthStore.getState().clear();
    }, []);

    return {
        user,
        accessToken,
        isAuthenticated: Boolean(accessToken),
        login,
        signup,
        logout,
    };
};
