import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { ApiError } from "@/api/client";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { FormInput } from "@/components/auth/form-input";
import { useAuth } from "@/hooks/use-auth";
import { emailRules, nameRules, passwordRules } from "@/utils/validation";

interface SignupValues {
    name: string;
    email: string;
    password: string;
}

export const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const {
        control,
        handleSubmit,
        setError,
        formState: { isSubmitting, errors },
    } = useForm<SignupValues>({
        defaultValues: { name: "", email: "", password: "" },
    });

    const onSubmit = async (data: SignupValues) => {
        try {
            await signup(data.name, data.email, data.password);
            navigate("/");
        } catch (err) {
            if (err instanceof ApiError && err.status === 409) {
                setError("email", { message: err.message || "Email already in use" });
                return;
            }
            const message =
                err instanceof ApiError ? err.message : "Couldn't create account. Please try again.";
            setError("root", { message });
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Get started with TeachReady in seconds"
            footer={
                <>
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-brand-secondary hover:underline">
                        Sign in
                    </Link>
                </>
            }
        >
            <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <FormInput<SignupValues>
                    control={control}
                    name="name"
                    rules={nameRules}
                    type="text"
                    label="Name"
                    placeholder="Your full name"
                    isRequired
                />
                <FormInput<SignupValues>
                    control={control}
                    name="email"
                    rules={emailRules}
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    isRequired
                />
                <FormInput<SignupValues>
                    control={control}
                    name="password"
                    rules={passwordRules}
                    type="password"
                    label="Password"
                    placeholder="Create a strong password"
                    isRequired
                    hint="8+ chars with uppercase, lowercase, number & symbol"
                />

                {errors.root && (
                    <p className="text-center text-sm text-error-primary">{errors.root.message}</p>
                )}

                <Button type="submit" size="md" color="primary" isLoading={isSubmitting} className="w-full">
                    Create account
                </Button>
            </Form>
        </AuthLayout>
    );
};
