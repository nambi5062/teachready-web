import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { ApiError } from "@/api/client";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { FormInput } from "@/components/auth/form-input";
import { useAuth } from "@/hooks/use-auth";
import { emailRules } from "@/utils/validation";

interface LoginValues {
    email: string;
    password: string;
}

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const {
        control,
        handleSubmit,
        setError,
        formState: { isSubmitting, errors },
    } = useForm<LoginValues>({
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: LoginValues) => {
        try {
            await login(data.email, data.password);
            navigate("/");
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : "Couldn't sign in. Please try again.";
            setError("root", { message });
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your account to continue"
            footer={
                <>
                    Don't have an account?{" "}
                    <Link to="/signup" className="font-semibold text-brand-secondary hover:underline">
                        Sign up
                    </Link>
                </>
            }
        >
            <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <FormInput<LoginValues>
                    control={control}
                    name="email"
                    rules={emailRules}
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    isRequired
                />
                <FormInput<LoginValues>
                    control={control}
                    name="password"
                    rules={{ required: "Password is required" }}
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    isRequired
                />

                <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-sm font-semibold text-brand-secondary hover:underline">
                        Forgot password?
                    </Link>
                </div>

                {errors.root && (
                    <p className="text-center text-sm text-error-primary">{errors.root.message}</p>
                )}

                <Button type="submit" size="md" color="primary" isLoading={isSubmitting} className="w-full">
                    Sign in
                </Button>
            </Form>
        </AuthLayout>
    );
};
