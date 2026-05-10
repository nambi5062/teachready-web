import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { FormInput } from "@/components/auth/form-input";
import { emailRules } from "@/utils/validation";

interface LoginValues {
    email: string;
    password: string;
}

export const Login = () => {
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<LoginValues>({
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: LoginValues) => {
        console.log("[login] submit", data);
        navigate("/");
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

                <Button type="submit" size="md" color="primary" isLoading={isSubmitting} className="w-full">
                    Sign in
                </Button>
            </Form>
        </AuthLayout>
    );
};
