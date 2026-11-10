
"use client";

import { useState } from "react";
import {
  Bot,
  X,
  MessageCircle,
  Sparkles,
  Leaf,
  Send,
} from "lucide-react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="
        pointer-events-none fixed
        bottom-[calc(96px+env(safe-area-inset-bottom))]
        right-4 z-[60]
        flex flex-col items-end
        lg:bottom-6 lg:right-6
      "
    >
      {/* CHAT PANEL */}
      {open && (
        <section
          role="dialog"
          aria-label="SAVORA AI Assistant"
          className="
            pointer-events-auto mb-3
            flex h-[min(440px,calc(100dvh-200px))]
            w-[min(350px,calc(100vw-32px))]
            flex-col overflow-hidden
            rounded-[26px]
            border border-white
            bg-[#F8F6ED]
            shadow-[0_15px_50px_rgba(20,65,40,0.22)]
            lg:h-[440px]
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between bg-[#245C43] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                <Bot size={22} />
              </div>

              <div>
                <h3 className="text-sm font-extrabold">
                  SAVORA AI
                </h3>

                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/75">
                  <Sparkles size={11} />
                  Asisten Pertanian
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup chatbot"
              className="rounded-full p-2 transition hover:bg-white/15"
            >
              <X size={20} />
            </button>
          </div>

          {/* CHAT CONTENT */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
            <div className="mb-5 flex justify-center">
              <span className="rounded-full bg-[#E8F0DD] px-3 py-1.5 text-[10px] font-bold text-[#668065]">
                SAVORA Assistant
              </span>
            </div>

            <div className="flex items-start gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#DDEBD5] text-[#245C43]">
                <Leaf size={17} />
              </div>

              <div className="max-w-[85%] rounded-[18px] rounded-tl-sm bg-white p-4 shadow-sm">
                <p className="text-sm font-bold text-[#245C43]">
                  Halo! 👋
                </p>

                <p className="mt-2 text-xs leading-6 text-[#637663]">
                  Selamat datang di SAVORA! Saya akan
                  membantu menjawab pertanyaan seputar
                  surplus panen dan pengelolaan hasil
                  pertanian.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#E4E9DA] bg-[#F0F3E8] p-3">
              <p className="flex items-center gap-2 text-[11px] font-bold text-[#678166]">
                <Sparkles size={14} />
                Informasi
              </p>

              <p className="mt-2 text-xs leading-5 text-[#71816E]">
                Fitur percakapan AI masih dalam tahap
                pengembangan dan belum terhubung ke
                layanan AI.
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t border-[#E6E8DE] bg-[#F8F6ED] p-3">
            <div className="flex items-center gap-2 rounded-full border border-[#E5E8DE] bg-white px-4 py-3">
              <span className="flex-1 text-xs text-[#9AA69A]">
                Chat AI segera hadir...
              </span>

              <Send size={17} className="text-[#9AA69A]" />
            </div>

            <p className="mt-2 text-center text-[10px] text-[#9AA69A]">
              Powered by SAVORA
            </p>
          </div>
        </section>
      )}

      {/* FLOATING BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={
          open ? "Tutup asisten AI" : "Buka asisten AI"
        }
        aria-expanded={open}
        className="
          pointer-events-auto relative
          flex h-12 w-12 items-center justify-center
          rounded-full border-[3px] border-[#F8F6ED]
          bg-gradient-to-br from-[#3BAE62] to-[#087338]
          text-white
          shadow-[0_5px_18px_rgba(15,100,55,0.3)]
          transition duration-200
          hover:scale-105 active:scale-95
          lg:h-14 lg:w-14
        "
      >
        {open ? (
          <X size={21} />
        ) : (
          <MessageCircle size={22} />
        )}

        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#F8F6ED] bg-[#F5C842]">
            <Sparkles size={8} className="text-[#245C43]" />
          </span>
        )}
      </button>
    </div>
  );
}
