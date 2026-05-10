import { Route, Routes } from "react-router";
import { HomeScreen } from "@/pages/home-screen";
import { NotFound } from "@/pages/not-found";
import { RouteProvider } from "@/providers/router-provider";

export const App = () => (
    <RouteProvider>
        <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </RouteProvider>
);
