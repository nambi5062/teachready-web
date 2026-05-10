export const decodeJwtExp = (token: string): number | null => {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);

        const claims = JSON.parse(atob(padded)) as { exp?: unknown };
        return typeof claims.exp === "number" ? claims.exp : null;
    } catch {
        return null;
    }
};
