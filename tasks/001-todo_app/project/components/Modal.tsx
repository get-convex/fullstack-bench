import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  children: React.ReactNode;
}

export function Modal({ open, onOpenChange, title, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0C0C0D] border border-[#1A1A1A] rounded-lg shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1A1A1A] px-4 py-3">
            <Dialog.Title className="text-sm font-medium text-white">
              {title}
            </Dialog.Title>
            <Dialog.Close className="text-[#8A8A8A] hover:text-white transition-colors">
              <X size={16} />
            </Dialog.Close>
          </div>
          <div className="p-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
