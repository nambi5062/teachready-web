import { UntitledLogoMinimal } from "@/components/foundations/logo/untitledui-logo-minimal";
import { cx } from "@/utils/cx";

export const TeachReadyBrand = ({ className }: { className?: string }) => (
    <div className={cx("flex items-center gap-2", className)}>
        <UntitledLogoMinimal className="size-6" />
        <span className="text-md font-semibold text-primary">TeachReady</span>
    </div>
);
