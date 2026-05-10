import { ChevronSelectorVertical, LogOut01, Monitor01, Moon01, Settings01, Sun } from "@untitledui/icons";
import type { Selection } from "react-aria-components";
import { Button as AriaButton, SubmenuTrigger } from "react-aria-components";
import { useNavigate } from "react-router";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/providers/theme-provider";
import { cx } from "@/utils/cx";

const initialsOf = (name?: string, email?: string) => {
    const src = (name || email || "?").trim();
    return src.slice(0, 1).toUpperCase();
};

export const UserDropdown = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();

    const themeSelection: Selection = new Set([theme]);
    const onThemeChange = (sel: Selection) => {
        if (sel === "all") return;
        const next = sel.values().next().value;
        if (next === "light" || next === "dark" || next === "system") {
            setTheme(next);
        }
    };

    const handleSignOut = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    return (
        <Dropdown.Root>
            <AriaButton
                className={({ isPressed, isFocusVisible }) =>
                    cx(
                        "relative w-full cursor-pointer rounded-lg bg-primary_alt p-2 pr-9 text-left inset-ring-1 inset-ring-border-secondary outline-offset-2 outline-focus-ring",
                        (isPressed || isFocusVisible) && "outline-2",
                    )
                }
            >
                <AvatarLabelGroup
                    size="md"
                    title={user?.name ?? user?.email ?? "Account"}
                    subtitle={user?.email ?? ""}
                    initials={initialsOf(user?.name, user?.email)}
                />
                <div className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md">
                    <ChevronSelectorVertical className="size-4 shrink-0 stroke-[2.25px] text-fg-quaternary" />
                </div>
            </AriaButton>

            <Dropdown.Popover className="w-60" placement="top">
                <Dropdown.Menu>
                    <Dropdown.Item icon={Settings01} onAction={() => navigate("/settings/account")}>
                        Account settings
                    </Dropdown.Item>

                    <SubmenuTrigger>
                        <Dropdown.Item icon={Moon01}>Preferences</Dropdown.Item>
                        <Dropdown.Popover placement="right top" offset={-6} className="w-44">
                            <Dropdown.Menu>
                                <Dropdown.Section
                                    selectionMode="single"
                                    selectedKeys={themeSelection}
                                    onSelectionChange={onThemeChange}
                                >
                                    <Dropdown.Item id="light" icon={Sun}>
                                        Light
                                    </Dropdown.Item>
                                    <Dropdown.Item id="dark" icon={Moon01}>
                                        Dark
                                    </Dropdown.Item>
                                    <Dropdown.Item id="system" icon={Monitor01}>
                                        System
                                    </Dropdown.Item>
                                </Dropdown.Section>
                            </Dropdown.Menu>
                        </Dropdown.Popover>
                    </SubmenuTrigger>

                    <Dropdown.Separator />

                    <Dropdown.Item icon={LogOut01} onAction={handleSignOut}>
                        Sign out
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
};
