import { type ChangeEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowUp, Copy01, ThumbsDown, ThumbsUp } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { TextAreaBase } from "@/components/base/textarea/textarea";
import { UntitledLogoMinimal } from "@/components/foundations/logo/untitledui-logo-minimal";
import { useClipboard } from "@/hooks/use-clipboard";
import { cx } from "@/utils/cx";

type Role = "user" | "assistant";
type Feedback = "up" | "down" | null;

interface Message {
    id: string;
    role: Role;
    content: string;
    feedback?: Feedback;
    pending?: boolean;
}

const STUB_REPLY = "This is a placeholder response from TeachReady. Backend wiring is coming next.";
const STUB_DELAY_MS = 600;

const newId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

const ThinkingDots = () => (
    <span className="inline-flex items-center gap-1" aria-label="Assistant is typing">
        <span className="size-1.5 animate-bounce rounded-full bg-fg-quaternary [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-fg-quaternary [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-fg-quaternary" />
    </span>
);

interface MessageActionsProps {
    message: Message;
    onCopy: (m: Message) => void;
    onFeedback: (m: Message, f: Feedback) => void;
    isCopied: boolean;
}

const MessageActions = ({ message, onCopy, onFeedback, isCopied }: MessageActionsProps) => (
    <div className="flex items-center gap-1">
        <ButtonUtility
            size="xs"
            color="tertiary"
            icon={Copy01}
            tooltip={isCopied ? "Copied" : "Copy"}
            onClick={() => onCopy(message)}
        />
        <ButtonUtility
            size="xs"
            color="tertiary"
            icon={ThumbsUp}
            tooltip="Good response"
            className={cx(message.feedback === "up" && "text-fg-success-primary")}
            onClick={() => onFeedback(message, message.feedback === "up" ? null : "up")}
        />
        <ButtonUtility
            size="xs"
            color="tertiary"
            icon={ThumbsDown}
            tooltip="Bad response"
            className={cx(message.feedback === "down" && "text-fg-error-primary")}
            onClick={() => onFeedback(message, message.feedback === "down" ? null : "down")}
        />
    </div>
);

interface MessageBubbleProps {
    message: Message;
    onCopy: (m: Message) => void;
    onFeedback: (m: Message, f: Feedback) => void;
    isCopied: boolean;
}

const MessageBubble = ({ message, onCopy, onFeedback, isCopied }: MessageBubbleProps) => {
    const isUser = message.role === "user";

    return (
        <div className={cx("flex w-full gap-3", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <UntitledLogoMinimal className="size-5" />
                </div>
            )}

            <div className={cx("flex max-w-[85%] flex-col gap-2", isUser && "items-end")}>
                <div
                    className={cx(
                        "rounded-2xl px-4 py-3 text-md leading-relaxed whitespace-pre-wrap",
                        isUser
                            ? "rounded-tr-sm bg-brand-solid text-white"
                            : "rounded-tl-sm bg-secondary text-primary",
                    )}
                >
                    {message.pending ? <ThinkingDots /> : message.content}
                </div>

                {!isUser && !message.pending && (
                    <MessageActions
                        message={message}
                        onCopy={onCopy}
                        onFeedback={onFeedback}
                        isCopied={isCopied}
                    />
                )}
            </div>
        </div>
    );
};

interface ComposerProps {
    value: string;
    onChange: (next: string) => void;
    onSend: () => void;
    isSending: boolean;
}

const Composer = ({ value, onChange, onSend, isSending }: ComposerProps) => {
    const canSend = value.trim().length > 0 && !isSending;

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (canSend) onSend();
        }
    };

    return (
        <div className="relative w-full rounded-2xl bg-primary shadow-lg ring-1 ring-secondary_alt">
            <TextAreaBase
                value={value}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message TeachReady…"
                rows={1}
                aria-label="Message"
                className="max-h-48 min-h-[52px] w-full resize-none rounded-2xl border-0 bg-transparent pr-14 ring-0 focus:ring-0"
            />
            <div className="absolute right-2 bottom-2">
                <Button
                    size="sm"
                    color="primary"
                    iconLeading={ArrowUp}
                    isDisabled={!canSend}
                    isLoading={isSending}
                    aria-label="Send message"
                    className="!size-9 !rounded-full !p-0"
                    onClick={onSend}
                />
            </div>
        </div>
    );
};

export const HomeScreen = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const { copied, copy } = useClipboard();
    const scrollerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollerRef.current?.scrollTo({
            top: scrollerRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const handleSend = () => {
        const text = input.trim();
        if (!text || isSending) return;

        const userMsg: Message = { id: newId(), role: "user", content: text };
        const pendingId = newId();
        const pendingMsg: Message = {
            id: pendingId,
            role: "assistant",
            content: "",
            pending: true,
        };

        setMessages((prev) => [...prev, userMsg, pendingMsg]);
        setInput("");
        setIsSending(true);

        window.setTimeout(() => {
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === pendingId ? { ...m, content: STUB_REPLY, pending: false } : m,
                ),
            );
            setIsSending(false);
        }, STUB_DELAY_MS);
    };

    const handleCopy = (m: Message) => {
        void copy(m.content, m.id);
    };

    const handleFeedback = (m: Message, f: Feedback) => {
        setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, feedback: f } : x)));
    };

    const isEmpty = messages.length === 0;

    return (
        <div className="flex h-dvh flex-col">
            {isEmpty ? (
                <div className="flex flex-1 flex-col items-center justify-center px-4">
                    <div className="flex w-full max-w-2xl flex-col items-center gap-8">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <UntitledLogoMinimal className="size-10" />
                            <h1 className="text-display-sm font-semibold text-primary">
                                How can I help you today?
                            </h1>
                            <p className="text-md text-tertiary">
                                Ask anything — TeachReady is here to help.
                            </p>
                        </div>

                        <div className="w-full">
                            <Composer
                                value={input}
                                onChange={setInput}
                                onSend={handleSend}
                                isSending={isSending}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div ref={scrollerRef} className="flex-1 overflow-y-auto">
                        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
                            {messages.map((m) => (
                                <MessageBubble
                                    key={m.id}
                                    message={m}
                                    onCopy={handleCopy}
                                    onFeedback={handleFeedback}
                                    isCopied={copied === m.id}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-secondary bg-primary">
                        <div className="mx-auto max-w-3xl px-4 py-4">
                            <Composer
                                value={input}
                                onChange={setInput}
                                onSend={handleSend}
                                isSending={isSending}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
