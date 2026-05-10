import { refreshTokens } from "@/api/client";
import { useAuthStore } from "@/store/auth";
import { decodeJwtExp } from "@/utils/jwt";

const REFRESH_BUFFER_MS = 30_000;

let timerId: ReturnType<typeof setTimeout> | null = null;
let started = false;

const clearTimer = () => {
    if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
    }
};

const computeDelay = (accessToken: string | null): number | null => {
    if (!accessToken) return null;
    const exp = decodeJwtExp(accessToken);
    if (exp === null) return null;
    return exp * 1000 - Date.now() - REFRESH_BUFFER_MS;
};

const schedule = (accessToken: string | null) => {
    clearTimer();
    if (!accessToken) return;

    const delay = computeDelay(accessToken);
    if (delay === null) return;

    if (delay <= 0) {
        void refreshTokens();
        return;
    }

    timerId = setTimeout(() => {
        void refreshTokens();
    }, delay);
};

const onVisibilityChange = () => {
    if (document.visibilityState !== "visible") return;

    const { accessToken } = useAuthStore.getState();
    const delay = computeDelay(accessToken);

    if (delay !== null && delay <= 0) {
        void refreshTokens();
    }
};

export const startAuthRefreshScheduler = () => {
    if (started) return;
    started = true;

    schedule(useAuthStore.getState().accessToken);

    useAuthStore.subscribe((state, prev) => {
        if (state.accessToken !== prev.accessToken) {
            schedule(state.accessToken);
        }
    });

    document.addEventListener("visibilitychange", onVisibilityChange);
};
