import { Controller, type Control, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";
import { Input, type InputProps } from "@/components/base/input/input";

interface FormInputProps<T extends FieldValues>
    extends Omit<InputProps, "value" | "onChange" | "onBlur" | "isInvalid" | "hint" | "name"> {
    name: Path<T>;
    control: Control<T>;
    rules?: RegisterOptions<T, Path<T>>;
    hint?: string;
}

export const FormInput = <T extends FieldValues>({
    name,
    control,
    rules,
    hint: defaultHint,
    ...inputProps
}: FormInputProps<T>) => (
    <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
            <Input
                {...inputProps}
                value={(field.value ?? "") as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={fieldState.invalid}
                hint={fieldState.error?.message ?? defaultHint}
            />
        )}
    />
);
