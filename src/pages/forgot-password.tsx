import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { FormInput } from "@/components/auth/form-input";
import { emailRules, passwordRules } from "@/utils/validation";

interface EmailStepValues {
    email: string;
}

interface ResetStepValues {
    password: string;
    confirmPassword: string;
}

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<"email" | "reset">("email");
    const [email, setEmail] = useState("");

    const emailForm = useForm<EmailStepValues>({ defaultValues: { email: "" } });
    const resetForm = useForm<ResetStepValues>({
        defaultValues: { password: "", confirmPassword: "" },
    });

    const onEmailSubmit = (data: EmailStepValues) => {
        console.log("[forgot-password] step 1 email", data);
        setEmail(data.email);
        setStep("reset");
    };

    const onResetSubmit = (data: ResetStepValues) => {
        console.log("[forgot-password] step 2 reset", { email, password: data.password });
        navigate("/login");
    };

    const password = resetForm.watch("password");

    if (step === "email") {
        return (
            <AuthLayout
                title="Forgot your password?"
                subtitle="Enter your email and we'll send you a reset link"
                footer={
                    <Link to="/login" className="font-semibold text-brand-secondary hover:underline">
                        Back to sign in
                    </Link>
                }
            >
                <Form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="flex flex-col gap-5">
                    <FormInput<EmailStepValues>
                        control={emailForm.control}
                        name="email"
                        rules={emailRules}
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        isRequired
                    />
                    <Button
                        type="submit"
                        size="md"
                        color="primary"
                        isLoading={emailForm.formState.isSubmitting}
                        className="w-full"
                    >
                        Next
                    </Button>
                </Form>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Set a new password"
            subtitle={`Choose a new password for ${email}`}
            footer={
                <Link to="/login" className="font-semibold text-brand-secondary hover:underline">
                    Back to sign in
                </Link>
            }
        >
            <Form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="flex flex-col gap-5">
                <FormInput<ResetStepValues>
                    control={resetForm.control}
                    name="password"
                    rules={passwordRules}
                    type="password"
                    label="New password"
                    placeholder="Create a strong password"
                    isRequired
                    hint="8+ chars with uppercase, lowercase, number & symbol"
                />
                <FormInput<ResetStepValues>
                    control={resetForm.control}
                    name="confirmPassword"
                    rules={{
                        required: "Please confirm your password",
                        validate: (value) => value === password || "Passwords do not match",
                    }}
                    type="password"
                    label="Confirm password"
                    placeholder="Re-enter your password"
                    isRequired
                />
                <Button
                    type="submit"
                    size="md"
                    color="primary"
                    isLoading={resetForm.formState.isSubmitting}
                    className="w-full"
                >
                    Reset password
                </Button>
            </Form>
        </AuthLayout>
    );
};
