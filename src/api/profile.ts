import { apiFetch } from "@/api/client";
import type { AuthUser } from "@/store/auth";

export interface PreferencesPayload {
    subject: string;
    grade: string[];
}

export const updateProfileRequest = (payload: PreferencesPayload) =>
    apiFetch<AuthUser>("/auth/update-profile", {
        method: "POST",
        body: payload,
    });

export const fetchMeRequest = () => apiFetch<AuthUser>("/auth/me", { method: "GET" });
