import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { FormInput } from "@/components/auth/form-input";
import { emailRules, passwordRules } from "@/utils/validation";

interface SignupValues {
    email: string;
    password: string;
}

export const Signup = () => {
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SignupValues>({
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: SignupValues) => {
        console.log("[signup] submit", data);
        navigate("/");
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

                <Button type="submit" size="md" color="primary" isLoading={isSubmitting} className="w-full">
                    Create account
                </Button>
            </Form>
        </AuthLayout>
    );
};
