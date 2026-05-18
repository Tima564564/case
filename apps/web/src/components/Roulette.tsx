"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Drop } from "../lib/mock";

type Props = {
  isOpen: boolean;
  items: Drop[];
  result?: Drop;
  onClose: () => void;
  onSell?: () => void;
};

export function Roulette({ isOpen, items, result, onClose, onSell }: Props) {
  const strip = [...items, ...items, ...items, ...items];

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-end bg-black/70 p-2 backdrop-blur-md sm:place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-[8px] p-3"
            initial={{ y: 32, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 32, scale: 0.98 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">Opening</p>
                <h2 className="text-xl font-black">Gift roulette</h2>
              </div>
              <button onClick={onClose} className="rounded-[8px] border border-white/10 px-3 py-2 text-sm text-white/70">
                Close
              </button>
            </div>

            <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-black/40 py-4">
              <div className="absolute left-1/2 top-0 z-10 h-full w-px bg-cyanGlow shadow-[0_0_24px_#00f0ff]" />
              <motion.div
                className="flex gap-3"
                animate={{ x: ["0%", "-66%"] }}
                transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {strip.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className={`rarity-${item.rarity.toLowerCase()} grid h-24 min-w-28 place-items-center rounded-[8px] border border-white/10 bg-white/[.045] p-2 text-center`}
                    style={{ boxShadow: "inset 0 -3px 0 var(--rarity)" }}
                  >
                    <div>
                      <p className="text-xs font-bold">{item.name}</p>
                      <p className="mt-1 text-xs" style={{ color: "var(--rarity)" }}>
                        ${item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {result ? (
              <div className={`rarity-${result.rarity.toLowerCase()} mt-4 rounded-[8px] border border-white/10 bg-white/[.06] p-4 text-center shadow-mythic`}>
                <p className="text-sm text-white/60">You won</p>
                <p className="mt-1 text-2xl font-black" style={{ color: "var(--rarity)" }}>
                  {result.name}
                </p>
                <p className="text-white/70">${result.value}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={onSell} className="h-11 rounded-[8px] border border-white/10 bg-white/[.06] text-sm font-bold">
                    Sell
                  </button>
                  <button onClick={onClose} className="h-11 rounded-[8px] bg-cyanGlow text-sm font-black text-slate-950">
                    Keep
                  </button>
                </div>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
