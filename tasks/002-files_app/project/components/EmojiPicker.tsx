"use client";

import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface EmojiPickerProps {
  emoji: string;
  onEmojiSelect: (emoji: string) => void;
  buttonClassName?: string;
}

export default function EmojiPicker({
  emoji,
  onEmojiSelect,
}: EmojiPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="inline-flex items-center justify-center w-10 h-10 text-2xl bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-plum-600"
      >
        {emoji}
      </button>
      {showPicker && (
        <div
          className="absolute z-[100] mt-1"
          style={{
            minWidth: "352px",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="bg-slate-900 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5">
            <Picker
              data={data}
              onEmojiSelect={(emoji: { native: string }) => {
                onEmojiSelect(emoji.native);
                setShowPicker(false);
              }}
              theme="dark"
            />
          </div>
        </div>
      )}
    </div>
  );
}
