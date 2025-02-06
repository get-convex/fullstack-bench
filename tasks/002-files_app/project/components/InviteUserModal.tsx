import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteUser: (email: string) => void;
}

export default function InviteUserModal({
  isOpen,
  onClose,
  onInviteUser,
}: InviteUserModalProps) {
  const [email, setEmail] = useState("");

  const handleInvite = () => {
    if (!email.trim()) return;
    onInviteUser(email);
    setEmail("");
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-[#1C1C1F] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="px-6 py-4">
                  <Dialog.Title className="text-lg font-medium text-white mb-4">
                    Invite User
                  </Dialog.Title>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="block w-full bg-[#1C2128] border-gray-700 rounded-md text-gray-300 text-sm focus:border-[#8D2676] focus:ring-[#8D2676]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleInvite();
                          if (e.key === "Escape") onClose();
                        }}
                      />
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        onClick={onClose}
                        className="px-3 py-2 text-sm text-gray-400 hover:text-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleInvite}
                        disabled={!email.trim()}
                        className="px-3 py-2 text-sm bg-[#8D2676] text-white rounded-md hover:bg-[#7A2065] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Invite User
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}