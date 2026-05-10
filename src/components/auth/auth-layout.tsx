import type { PropsWithChildren, ReactNode } from "react";
import { UntitledLogoMinimal } from "@/components/foundations/logo/untitledui-logo-minimal";

interface AuthLayoutProps extends PropsWithChildren {
    title: string;
    subtitle: string;
    footer?: ReactNode;
}

export const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-primary px-4 py-12">
        <div className="flex w-full max-w-sm flex-col gap-8">
            <div className="flex flex-col items-center gap-6">
                <UntitledLogoMinimal className="size-10" />
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-display-sm font-semibold text-primary">{title}</h1>
                    <p className="text-md text-tertiary">{subtitle}</p>
                </div>
            </div>

            {children}

            {footer && <div className="text-center text-sm text-tertiary">{footer}</div>}
        </div>
    </div>
);
