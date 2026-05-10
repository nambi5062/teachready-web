import { apiFetch } from "@/api/client";
import type { AuthUser } from "@/store/auth";

export interface PreferencesPayload {
    subjects: string;
    grade: string[];
}

export const updateProfileRequest = (payload: PreferencesPayload) =>
    apiFetch<AuthUser>("/users/me", {
        method: "PATCH",
        body: payload,
    });
