import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useListData } from "react-stately";
import { ApiError } from "@/api/client";
import { fetchMeRequest, updateProfileRequest } from "@/api/profile";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import type { SelectItemType } from "@/components/base/select/select-shared";
import { TagSelect } from "@/components/base/select/tag-select";
import { useAuth } from "@/hooks/use-auth";

interface SubjectValues {
    subject: string;
}

const SUBJECT_OPTIONS = [
    { id: "Math", label: "Math" },
    { id: "English", label: "English" },
    { id: "Science", label: "Science" },
    { id: "Social Studies", label: "Social Studies" },
    { id: "Computer Science", label: "Computer Science" },
    { id: "Art", label: "Art" },
    { id: "Music", label: "Music" },
    { id: "Physical Education", label: "Physical Education" },
    { id: "Languages", label: "Languages" },
];

const GRADE_OPTIONS = [
    { id: "K", label: "Kindergarten" },
    { id: "1", label: "Grade 1" },
    { id: "2", label: "Grade 2" },
    { id: "3", label: "Grade 3" },
    { id: "4", label: "Grade 4" },
    { id: "5", label: "Grade 5" },
    { id: "6", label: "Grade 6" },
    { id: "7", label: "Grade 7" },
    { id: "8", label: "Grade 8" },
    { id: "9", label: "Grade 9" },
    { id: "10", label: "Grade 10" },
    { id: "11", label: "Grade 11" },
    { id: "12", label: "Grade 12" },
];

interface GradeTagSelectProps {
    grade: string[];
    setGrade: (next: string[]) => void;
    isInvalid?: boolean;
    hint?: string;
}

const GradeTagSelect = ({ grade, setGrade, isInvalid, hint }: GradeTagSelectProps) => {
    // useListData drives TagSelect's internal selected-tags rendering.
    // We sync it to the parent's `grade` state via the useEffect below
    // AND via the inline callbacks (belt-and-suspenders).
    const list = useListData<SelectItemType>({
        initialItems: GRADE_OPTIONS.filter((g) => grade.includes(g.id)),
    });

    // Push useListData -> parent state on every change.
    const itemsKey = list.items.map((i) => String(i.id)).join("|");
    useEffect(() => {
        const next = list.items.map((i) => String(i.id));
        const same = next.length === grade.length && next.every((id, i) => id === grade[i]);
        if (!same) {
            console.log("[GradeTagSelect] effect sync", next);
            setGrade(next);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsKey]);

    return (
        <TagSelect
            label="Grade level"
            placeholder="Search and add grade levels"
            items={GRADE_OPTIONS}
            selectedItems={list}
            shortcut={false}
            isInvalid={isInvalid}
            hint={hint}
            isRequired
            onItemInserted={(key) => {
                console.log("[GradeTagSelect] inserted", key);
                const next = [...list.items.map((i) => String(i.id)), String(key)];
                // De-dupe in case effect already ran.
                setGrade(Array.from(new Set(next)));
            }}
            onItemCleared={(key) => {
                console.log("[GradeTagSelect] cleared", key);
                const next = list.items.map((i) => String(i.id)).filter((v) => v !== String(key));
                setGrade(next);
            }}
        >
            {(item) => <TagSelect.Item id={item.id} label={item.label} />}
        </TagSelect>
    );
};

export const PreferencesModal = ({ isOpen }: { isOpen: boolean }) => {
    const { setUser } = useAuth();

    // Grade lives in plain React state — outside of react-hook-form — to
    // sidestep RHF/Controller/Compiler interop issues we hit with TagSelect.
    const [grade, setGrade] = useState<string[]>([]);
    const [gradeError, setGradeError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        setError,
        formState: { isSubmitting, errors },
    } = useForm<SubjectValues>({
        defaultValues: { subject: "" },
    });

    const onSubmit = async (data: SubjectValues) => {
        console.log("[PreferencesModal] submit — subject:", data.subject, "grade:", grade);

        if (grade.length === 0) {
            setGradeError("Pick at least one grade level");
            return;
        }
        setGradeError(null);

        try {
            await updateProfileRequest({ subject: data.subject, grade });
            const fresh = await fetchMeRequest();
            setUser(fresh);
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
                            <p className="text-sm text-tertiary">We use this to tailor TeachReady to what you teach. You can change it later.</p>
                        </div>

                        <Form
                            // onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col gap-5"
                        >
                            <Controller
                                name="subject"
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

                            <GradeTagSelect
                                grade={grade}
                                setGrade={(next) => {
                                    console.log("[PreferencesModal] setGrade ->", next);
                                    setGrade(next);
                                    if (next.length > 0) setGradeError(null);
                                }}
                                isInvalid={Boolean(gradeError)}
                                hint={gradeError ?? undefined}
                            />

                            {errors.root && <p className="text-center text-sm text-error-primary">{errors.root.message}</p>}

                            <Button
                                // type="submit"
                                size="md"
                                color="primary"
                                isLoading={isSubmitting}
                                className="w-full"
                                onClick={handleSubmit(onSubmit)}
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
