import { Route, Routes } from "react-router";
import { RequireAuth } from "@/components/auth/require-auth";
import { RequireGuest } from "@/components/auth/require-guest";
import { AppLayout } from "@/components/layout/app-layout";
import { AccountSettings } from "@/pages/account-settings";
import { ForgotPassword } from "@/pages/forgot-password";
import { HomeScreen } from "@/pages/home-screen";
import { Login } from "@/pages/login";
import { NotFound } from "@/pages/not-found";
import { Signup } from "@/pages/signup";
import { RouteProvider } from "@/providers/router-provider";

export const App = () => (
    <RouteProvider>
        <Routes>
            <Route element={<RequireAuth />}>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/settings/account" element={<AccountSettings />} />
                </Route>
            </Route>

            <Route element={<RequireGuest />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    </RouteProvider>
);
