import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthUser {
    id: string;
    email: string;
    name?: string;
    is_profile_exist?: boolean;
    subjects?: string;
    grade?: string[];
}

export interface AuthSession {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: AuthUser | null;

    setSession: (session: AuthSession) => void;
    setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
    setUser: (user: AuthUser) => void;
    clear: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            user: null,

            setSession: ({ accessToken, refreshToken, user }) =>
                set({ accessToken, refreshToken, user }),

            setTokens: ({ accessToken, refreshToken }) =>
                set({ accessToken, refreshToken }),

            setUser: (user) => set({ user }),

            clear: () => set({ accessToken: null, refreshToken: null, user: null }),
        }),
        {
            name: "teachready.auth",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
