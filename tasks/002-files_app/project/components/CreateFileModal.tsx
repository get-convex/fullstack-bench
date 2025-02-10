import { Fragment, useState } from "react";
import { Dialog, DialogTitle, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface CreateFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFile: (name: string, content: string) => void;
}

export default function CreateFileModal({
  isOpen,
  onClose,
  onCreateFile,
}: CreateFileModalProps) {
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");

  const handleCreate = () => {
    if (!fileName.trim()) return;
    onCreateFile(fileName, fileContent);
    setFileName("");
    setFileContent("");
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-visible rounded-lg bg-slate-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md text-slate-400 hover:text-slate-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="p-6">
                  <DialogTitle className="text-xl font-semibold text-white mb-6">
                    Create New File
                  </DialogTitle>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        File Name
                      </label>
                      <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="Enter file name"
                        className="block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-300 text-sm placeholder-slate-500 focus:border-plum-600 focus:ring-plum-600 focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Initial Content
                      </label>
                      <textarea
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        placeholder="Enter file content"
                        rows={12}
                        className="block w-full px-3 py-2 font-mono text-sm bg-slate-800 border border-slate-700 rounded-md text-slate-300 placeholder-slate-500 focus:border-plum-600 focus:ring-plum-600 focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreate}
                        disabled={!fileName.trim()}
                        className="px-4 py-2 text-sm font-medium bg-plum-600 text-white rounded-md hover:bg-plum-700 focus:outline-none focus:ring-2 focus:ring-plum-600 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Create File
                      </button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
