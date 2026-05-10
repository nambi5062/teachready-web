import { API_BASE_URL, API_PREFIX } from "@/api/config";
import { useAuthStore } from "@/store/auth";

export class ApiError extends Error {
    constructor(public status: number, message: string, public payload?: unknown) {
        super(message);
        this.name = "ApiError";
    }
}

export class AuthExpiredError extends Error {
    constructor() {
        super("Session expired. Please sign in again.");
        this.name = "AuthExpiredError";
    }
}

interface ApiOptions extends Omit<RequestInit, "body"> {
    body?: unknown;
    skipAuth?: boolean;
    _isRetry?: boolean;
}

let refreshInFlight: Promise<string | null> | null = null;

export const refreshTokens = async (): Promise<string | null> => {
    if (refreshInFlight) return refreshInFlight;

    refreshInFlight = (async () => {
        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) return null;

        const res = await fetch(`${API_BASE_URL}${API_PREFIX}/auth/refresh`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
            useAuthStore.getState().clear();
            return null;
        }

        const data = (await res.json()) as { accessToken: string; refreshToken: string };
        useAuthStore.getState().setTokens(data);
        return data.accessToken;
    })().finally(() => {
        refreshInFlight = null;
    });

    return refreshInFlight;
};

export const apiFetch = async <T>(path: string, options: ApiOptions = {}): Promise<T> => {
    const { body, skipAuth, _isRetry, headers, ...rest } = options;
    const { accessToken } = useAuthStore.getState();

    const res = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
        ...rest,
        headers: {
            "content-type": "application/json",
            ...(accessToken && !skipAuth ? { authorization: `Bearer ${accessToken}` } : {}),
            ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401 && !skipAuth && !_isRetry && !path.startsWith("/auth/refresh")) {
        const newToken = await refreshTokens();
        if (!newToken) throw new AuthExpiredError();
        return apiFetch<T>(path, { ...options, _isRetry: true });
    }

    const text = await res.text();
    const payload = text ? JSON.parse(text) : undefined;

    if (!res.ok) {
        const message =
            (payload && typeof payload === "object" && "message" in payload && String((payload as { message: unknown }).message)) ||
            `Request failed (${res.status})`;
        throw new ApiError(res.status, message, payload);
    }

    return payload as T;
};
