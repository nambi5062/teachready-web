import type { CSSProperties } from "react";
import { MessageChatCircle } from "@untitledui/icons";
import { Outlet, useLocation } from "react-router";
import { MobileNavigationHeader } from "@/components/application/app-navigation/base-components/mobile-header";
import { NavList } from "@/components/application/app-navigation/base-components/nav-list";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { TeachReadyBrand } from "@/components/layout/teach-ready-brand";
import { UserDropdown } from "@/components/layout/user-dropdown";
import { cx } from "@/utils/cx";

const SIDEBAR_WIDTH = 280;
const widthVar = { "--width": `${SIDEBAR_WIDTH}px` } as CSSProperties;

const NAV_ITEMS: NavItemType[] = [
    { label: "New chat", href: "/", icon: MessageChatCircle },
];

export const AppLayout = () => {
    const { pathname } = useLocation();

    const sidebar = (
        <aside
            style={widthVar}
            className={cx(
                "flex h-full w-full max-w-full flex-col justify-between overflow-auto bg-primary pt-4 lg:w-(--width) lg:pt-5",
                "border-secondary md:border-r",
            )}
        >
            <div className="flex flex-col gap-5 px-4 lg:px-5">
                <TeachReadyBrand className="h-6" />
            </div>

            <NavList activeUrl={pathname} items={NAV_ITEMS} />

            <div className="mt-auto flex flex-col gap-3 px-4 py-4 lg:py-5">
                <UserDropdown />
            </div>
        </aside>
    );

    return (
        <>
            <MobileNavigationHeader>{sidebar}</MobileNavigationHeader>
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex">{sidebar}</div>
            <main style={widthVar} className="lg:pl-(--width)">
                <Outlet />
            </main>
        </>
    );
};
