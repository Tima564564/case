"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info, X } from "lucide-react";
import type { Drop } from "../lib/mock";

type Props = {
  isOpen: boolean;
  items: Drop[];
  result?: Drop;
  caseName?: string;
  price?: number;
  balance?: number;
  onClose: () => void;
  onDeposit?: () => void;
  onSell?: () => void;
};

export function Roulette({ isOpen, items, result, caseName, price = 0, balance = 0, onClose, onDeposit, onSell }: Props) {
  const [revealed, setRevealed] = useState(false);
  const notEnoughFunds = !result && balance < price;
  const featured = items.slice(0, 3);
  const title = caseName ?? inferCaseName(items);

  useEffect(() => {
    if (!isOpen) {
      setRevealed(false);
      return;
    }
    if (!result) return;
    setRevealed(false);
    const timer = window.setTimeout(() => setRevealed(true), 1450);
    return () => window.clearTimeout(timer);
  }, [isOpen, result?.id]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-end bg-black/75 p-2 backdrop-blur-md sm:place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="max-h-[92dvh] w-full max-w-[380px] overflow-y-auto rounded-[14px] border border-white/10 bg-[#151515] p-4 shadow-[0_24px_100px_rgba(0,0,0,.75)]" initial={{ y: 36, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 36, scale: 0.98 }}>
            <div className="flex items-center justify-between">
              <div className="w-10" />
              <h2 className="truncate text-center text-lg font-black">{title}</h2>
              <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-[8px] text-white/80" aria-label="Close"><X size={24} /></button>
            </div>

            <div className="relative mt-3 overflow-hidden rounded-[10px] bg-[#101010] px-4 py-2">
              <div className="absolute inset-y-0 left-1/2 w-24 -translate-x-1/2 bg-blue-500/20 blur-2xl" />
              <div className="absolute bottom-0 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-blue-500 shadow-[0_0_24px_rgba(24,119,242,.8)]" />
              <div className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
                {featured.map((item) => <PrizePreview key={item.id} item={item} />)}
              </div>
            </div>

            {notEnoughFunds ? (
              <div className="mt-16 text-center">
                <div className="mx-auto grid h-6 w-6 place-items-center rounded-full bg-white text-[#151515]"><Info size={15} /></div>
                <p className="mt-3 text-sm font-black">Not enough funds</p>
                <button onClick={onDeposit} className="mt-6 h-12 w-full rounded-[10px] bg-[#1683ff] text-sm font-black text-white shadow-[0_16px_40px_rgba(22,131,255,.25)]">Deposit</button>
              </div>
            ) : result && !revealed ? (
              <OpeningDrop item={result} />
            ) : result ? (
              <ResultCard result={result} onSell={onSell} onClose={onClose} />
            ) : null}

            <div className="mt-12">
              <p className="px-2 text-sm font-bold text-white/45">Possible prizes:</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {items.map((item) => <PrizeTile key={item.id} item={item} />)}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function OpeningDrop({ item }: { item: Drop }) {
  return (
    <div className={`rarity-${item.rarity.toLowerCase()} relative mt-8 h-56 overflow-hidden rounded-[14px] border border-white/10 bg-[radial-gradient(circle_at_50%_78%,rgba(22,131,255,.26),rgba(255,255,255,.06)_35%,rgba(0,0,0,.2)_70%)]`}>
      <motion.div className="absolute left-1/2 top-6 h-36 w-36 -translate-x-1/2 rounded-full blur-2xl" style={{ backgroundColor: "var(--rarity)", opacity: 0.3 }} animate={{ scale: [0.8, 1.25, 0.9], opacity: [0.12, 0.42, 0.18] }} transition={{ duration: 1.2, repeat: Infinity }} />
      <motion.img
        src={item.imageUrl}
        alt={item.name}
        className="absolute left-1/2 h-28 w-28 -translate-x-1/2 object-contain drop-shadow-[0_24px_34px_rgba(0,0,0,.7)]"
        initial={{ y: -130, rotate: -18, scale: 0.72 }}
        animate={{ y: [ -130, 76, 54, 66 ], rotate: [-18, 10, -4, 0], scale: [0.72, 1.22, 1, 1.05] }}
        transition={{ duration: 1.22, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div className="absolute bottom-8 left-1/2 h-3 w-36 -translate-x-1/2 rounded-full bg-black/50 blur-sm" animate={{ scaleX: [0.25, 1.1, 0.84], opacity: [0.15, 0.7, 0.45] }} transition={{ duration: 1.22 }} />
      <motion.div className="absolute inset-x-6 bottom-9 h-px bg-gradient-to-r from-transparent via-white to-transparent" initial={{ opacity: 0, scaleX: 0.2 }} animate={{ opacity: [0, 1, 0], scaleX: [0.2, 1.2, 0.7] }} transition={{ delay: 0.72, duration: 0.55 }} />
      <motion.p className="absolute inset-x-0 bottom-5 text-center text-sm font-black text-white/80" animate={{ opacity: [0.45, 1, 0.65] }} transition={{ duration: 0.8, repeat: Infinity }}>
        Opening...
      </motion.p>
    </div>
  );
}

function ResultCard({ result, onSell, onClose }: { result: Drop; onSell?: () => void; onClose: () => void }) {
  return (
    <motion.div className={`rarity-${result.rarity.toLowerCase()} mt-8 rounded-[12px] border border-white/10 bg-white/[.06] p-4 text-center shadow-mythic`} initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45 }}>
      <motion.img src={result.imageUrl} alt={result.name} className="mx-auto h-24 w-24 object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,.65)]" initial={{ scale: 0.72, rotate: -8 }} animate={{ scale: [0.72, 1.12, 1], rotate: [-8, 5, 0] }} transition={{ duration: 0.65, ease: "easeOut" }} />
      <p className="mt-4 text-sm text-white/60">You received</p>
      <p className="mt-1 text-2xl font-black" style={{ color: "var(--rarity)" }}>{result.name}</p>
      <p className="text-white/70">{result.value.toFixed(2)} TON</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button onClick={onSell} className="h-11 rounded-[10px] border border-white/10 bg-white/[.06] text-sm font-bold">Sell</button>
        <button onClick={onClose} className="h-11 rounded-[10px] bg-[#1683ff] text-sm font-black text-white">Keep</button>
      </div>
    </motion.div>
  );
}

function inferCaseName(items: Drop[]) {
  const firstId = items[0]?.id ?? "";
  if (firstId.startsWith("perfume-")) return "Perfume";
  if (firstId.startsWith("pepe-")) return "Plush Frog";
  if (firstId.startsWith("cap-")) return "Durov Cap";
  if (firstId.startsWith("holiday-")) return "Holiday Drop";
  return "Gift Case";
}

function PrizePreview({ item }: { item: Drop }) {
  return (
    <div className={`rarity-${item.rarity.toLowerCase()} relative grid h-28 min-w-[122px] snap-center place-items-center overflow-hidden rounded-[10px] border border-white/10 bg-gradient-to-br from-white/[.12] to-black/25`} style={{ boxShadow: "inset 0 -2px 0 var(--rarity)" }}>
      <TonBadge value={item.value} />
      <motion.img src={item.imageUrl} alt={item.name} className="relative z-10 h-16 w-16 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,.6)]" animate={{ y: [0, -5, 0], scale: [1, 1.06, 1] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />
      <p className="absolute bottom-2 max-w-[100px] truncate text-xs font-black">{item.name}</p>
    </div>
  );
}

function PrizeTile({ item }: { item: Drop }) {
  return (
    <div className={`rarity-${item.rarity.toLowerCase()} relative min-h-24 overflow-hidden rounded-[12px] border border-white/10 bg-white/[.06] p-2`} style={{ boxShadow: "inset 0 -2px 0 var(--rarity)" }}>
      <TonBadge value={item.value} />
      <img src={item.imageUrl} alt={item.name} className="mx-auto mt-6 h-12 w-12 object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,.45)]" />
      <p className="mt-2 truncate text-center text-[11px] font-black">{item.name}</p>
    </div>
  );
}

function TonBadge({ value }: { value: number }) {
  return <div className="absolute left-2 top-2 z-20 flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[11px] font-black text-white backdrop-blur"><span className="grid h-4 w-4 place-items-center rounded-full bg-[#1683ff] text-[9px]">T</span>{value}</div>;
}
