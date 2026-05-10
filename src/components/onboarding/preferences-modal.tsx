import { Controller, useForm } from "react-hook-form";
import { useListData } from "react-stately";
import { ApiError } from "@/api/client";
import { updateProfileRequest } from "@/api/profile";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import type { SelectItemType } from "@/components/base/select/select-shared";
import { TagSelect } from "@/components/base/select/tag-select";
import { useAuth } from "@/hooks/use-auth";

interface PrefValues {
    subjects: string;
    grade: string[];
}

const SUBJECT_OPTIONS = [
    { id: "mathematics", label: "Mathematics" },
    { id: "english", label: "English" },
    { id: "science", label: "Science" },
    { id: "social-studies", label: "Social Studies" },
    { id: "computer-science", label: "Computer Science" },
    { id: "art", label: "Art" },
    { id: "music", label: "Music" },
    { id: "physical-education", label: "Physical Education" },
    { id: "languages", label: "Languages" },
];

const GRADE_OPTIONS = [
    { id: "k-2", label: "K – Grade 2" },
    { id: "3-5", label: "Grades 3 – 5" },
    { id: "6-8", label: "Grades 6 – 8" },
    { id: "9-12", label: "Grades 9 – 12" },
    { id: "higher-ed", label: "Higher Education" },
];

interface GradeTagSelectProps {
    value: string[];
    onChange: (next: string[]) => void;
    isInvalid?: boolean;
    hint?: string;
}

const GradeTagSelect = ({ value, onChange, isInvalid, hint }: GradeTagSelectProps) => {
    const list = useListData<SelectItemType>({
        initialItems: GRADE_OPTIONS.filter((g) => value.includes(g.id)),
    });

    return (
        <TagSelect
            label="Grade level"
            placeholder="Search and add grade levels"
            items={GRADE_OPTIONS}
            selectedItems={list}
            onItemInserted={(key) => onChange([...value, String(key)])}
            onItemCleared={(key) => onChange(value.filter((v) => v !== String(key)))}
            shortcut={false}
            isInvalid={isInvalid}
            hint={hint}
            isRequired
        >
            {(item) => <TagSelect.Item id={item.id} label={item.label} />}
        </TagSelect>
    );
};

export const PreferencesModal = ({ isOpen }: { isOpen: boolean }) => {
    const { setUser } = useAuth();
    const {
        control,
        handleSubmit,
        setError,
        formState: { isSubmitting, errors },
    } = useForm<PrefValues>({
        defaultValues: { subjects: "", grade: [] },
    });

    const onSubmit = async (data: PrefValues) => {
        try {
            const updated = await updateProfileRequest(data);
            setUser(updated);
        } catch (err) {
            setError("root", {
                message: err instanceof ApiError ? err.message : "Couldn't save. Please try again.",
            });
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} isDismissable={false} isKeyboardDismissDisabled>
            <Modal>
                <Dialog>
                    <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-primary p-6 shadow-xl">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-display-xs font-semibold text-primary">Tell us a bit more</h2>
                            <p className="text-sm text-tertiary">
                                We use this to tailor TeachReady to what you teach. You can change it later.
                            </p>
                        </div>

                        <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                            <Controller
                                name="subjects"
                                control={control}
                                rules={{ required: "Pick a subject" }}
                                render={({ field, fieldState }) => (
                                    <Select.ComboBox
                                        label="Subject"
                                        placeholder="Search for a subject"
                                        items={SUBJECT_OPTIONS}
                                        selectedKey={field.value || null}
                                        onSelectionChange={(key) => field.onChange(key == null ? "" : String(key))}
                                        shortcut={false}
                                        isInvalid={fieldState.invalid}
                                        hint={fieldState.error?.message}
                                        isRequired
                                    >
                                        {(item) => <SelectItem id={item.id} label={item.label} />}
                                    </Select.ComboBox>
                                )}
                            />

                            <Controller
                                name="grade"
                                control={control}
                                rules={{
                                    validate: (v) => (v?.length ?? 0) > 0 || "Pick at least one grade level",
                                }}
                                render={({ field, fieldState }) => (
                                    <GradeTagSelect
                                        value={field.value}
                                        onChange={field.onChange}
                                        isInvalid={fieldState.invalid}
                                        hint={fieldState.error?.message}
                                    />
                                )}
                            />

                            {errors.root && (
                                <p className="text-center text-sm text-error-primary">{errors.root.message}</p>
                            )}

                            <Button
                                type="submit"
                                size="md"
                                color="primary"
                                isLoading={isSubmitting}
                                className="w-full"
                            >
                                Save & continue
                            </Button>
                        </Form>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};
