import { BrutalCard } from "./BrutalCard";
import { BrutalButton } from "./BrutalButton";

interface BrutalConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export function BrutalConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel"
}: BrutalConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
                <BrutalCard color="white" className="p-6 md:p-8">
                    <h2 className="font-heading text-2xl font-bold mb-4">{title}</h2>
                    <p className="font-mono text-base mb-8">{message}</p>

                    <div className="flex gap-4 justify-end">
                        <BrutalButton variant="ghost" onClick={onCancel} className="flex-1 max-w-[120px]">
                            {cancelText}
                        </BrutalButton>
                        <BrutalButton variant="primary" onClick={onConfirm} className="flex-1 max-w-[120px] bg-brutal-yellow text-black border-2 border-black">
                            {confirmText}
                        </BrutalButton>
                    </div>
                </BrutalCard>
            </div>
        </div>
    );
}
