import { Route, Routes } from "react-router";
import { ForgotPassword } from "@/pages/forgot-password";
import { HomeScreen } from "@/pages/home-screen";
import { Login } from "@/pages/login";
import { NotFound } from "@/pages/not-found";
import { Signup } from "@/pages/signup";
import { RouteProvider } from "@/providers/router-provider";

export const App = () => (
    <RouteProvider>
        <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </RouteProvider>
);
