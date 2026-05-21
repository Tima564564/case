"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Gift, Info, Sparkles, X } from "lucide-react";
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
  const notEnoughFunds = !result && balance < price;
  const featured = items.slice(0, 3);
  const title = caseName ?? inferCaseName(items);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-end bg-black/75 p-2 backdrop-blur-md sm:place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="max-h-[92dvh] w-full max-w-[380px] overflow-y-auto rounded-[14px] border border-white/10 bg-[#151515] p-4 shadow-[0_24px_100px_rgba(0,0,0,.75)]" initial={{ y: 36, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 36, scale: 0.98 }}>
            <div className="flex items-center justify-between"><div className="w-10" /><h2 className="truncate text-center text-lg font-black">{title}</h2><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-[8px] text-white/80" aria-label="Close"><X size={24} /></button></div>
            <div className="relative mt-3 overflow-hidden rounded-[10px] bg-[#101010] px-4 py-2"><div className="absolute inset-y-0 left-1/2 w-24 -translate-x-1/2 bg-blue-500/20 blur-2xl" /><div className="absolute inset-x-1/2 bottom-0 h-1 w-24 -translate-x-1/2 rounded-full bg-blue-500 shadow-[0_0_24px_rgba(24,119,242,.8)]" /><div className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">{featured.map((item) => <PrizePreview key={item.id} item={item} />)}</div></div>
            {notEnoughFunds ? <div className="mt-16 text-center"><div className="mx-auto grid h-6 w-6 place-items-center rounded-full bg-white text-[#151515]"><Info size={15} /></div><p className="mt-3 text-sm font-black">Not enough funds</p><button onClick={onDeposit} className="mt-6 h-12 w-full rounded-[10px] bg-[#1683ff] text-sm font-black text-white shadow-[0_16px_40px_rgba(22,131,255,.25)]">Deposit</button></div> : result ? <motion.div className={`rarity-${result.rarity.toLowerCase()} mt-8 rounded-[12px] border border-white/10 bg-white/[.06] p-4 text-center shadow-mythic`} initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45 }}><div className="mx-auto grid h-20 w-20 place-items-center rounded-[12px] bg-black/30" style={{ color: "var(--rarity)" }}><Gift size={38} /></div><p className="mt-4 text-sm text-white/60">You received</p><p className="mt-1 text-2xl font-black" style={{ color: "var(--rarity)" }}>{result.name}</p><p className="text-white/70">{result.value.toFixed(2)} TON</p><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={onSell} className="h-11 rounded-[10px] border border-white/10 bg-white/[.06] text-sm font-bold">Sell</button><button onClick={onClose} className="h-11 rounded-[10px] bg-[#1683ff] text-sm font-black text-white">Keep</button></div></motion.div> : null}
            <div className="mt-12"><p className="px-2 text-sm font-bold text-white/45">Possible prizes:</p><div className="mt-4 grid grid-cols-3 gap-3">{items.map((item) => <PrizeTile key={item.id} item={item} />)}</div></div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function inferCaseName(items: Drop[]) {
  const firstId = items[0]?.id ?? "";
  if (firstId.startsWith("perfume-")) return "Perfume";
  if (firstId.startsWith("pepe-")) return "Plush Pepe";
  if (firstId.startsWith("cap-")) return "Durov Cap";
  if (firstId.startsWith("holiday-")) return "Holiday Drop";
  return "Gift Case";
}

function PrizePreview({ item }: { item: Drop }) {
  return <div className={`rarity-${item.rarity.toLowerCase()} relative grid h-28 min-w-[122px] snap-center place-items-center overflow-hidden rounded-[10px] border border-white/10 bg-gradient-to-br from-white/[.12] to-black/25`} style={{ boxShadow: "inset 0 -2px 0 var(--rarity)" }}><TonBadge value={item.value} /><Gift className="relative z-10 text-white drop-shadow-[0_8px_18px_rgba(0,0,0,.6)]" size={46} /><p className="absolute bottom-2 max-w-[100px] truncate text-xs font-black">{item.name}</p></div>;
}

function PrizeTile({ item }: { item: Drop }) {
  return <div className={`rarity-${item.rarity.toLowerCase()} relative min-h-24 overflow-hidden rounded-[12px] border border-white/10 bg-white/[.06] p-2`} style={{ boxShadow: "inset 0 -2px 0 var(--rarity)" }}><TonBadge value={item.value} /><div className="mt-6 grid h-10 place-items-center"><Sparkles size={30} style={{ color: "var(--rarity)" }} /></div><p className="mt-2 truncate text-center text-[11px] font-black">{item.name}</p></div>;
}

function TonBadge({ value }: { value: number }) {
  return <div className="absolute left-2 top-2 z-20 flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[11px] font-black text-white backdrop-blur"><span className="grid h-4 w-4 place-items-center rounded-full bg-[#1683ff] text-[9px]">T</span>{value}</div>;
}
