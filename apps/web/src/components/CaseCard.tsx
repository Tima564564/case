"use client";

import { motion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";
import type { Drop } from "../lib/mock";

type Props = {
  name: string;
  price: number;
  image: string;
  hot: boolean;
  type: string;
  drops: Drop[];
  onOpen: () => void;
};

export function CaseCard({ name, price, image, hot, type, drops, onOpen }: Props) {
  const bestDrop = drops.reduce((best, drop) => (drop.value > best.value ? drop : best), drops[0]);

  return (
    <motion.article layout whileTap={{ scale: 0.98 }} className="relative overflow-hidden rounded-[12px] border border-white/10 bg-[#151515] p-3 shadow-[0_18px_50px_rgba(0,0,0,.45)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1683ff] to-transparent" />
      <div className="flex gap-3">
        <div className="relative grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-[12px] border border-white/10 bg-gradient-to-br from-[#17213a] via-[#151515] to-[#291b35]">
          <div className="absolute h-20 w-20 rounded-full bg-[#1683ff]/25 blur-2xl" />
          <div className="absolute left-4 right-4 top-4 h-5 rounded-[6px] bg-[#1683ff]/80 shadow-[0_0_24px_rgba(22,131,255,.55)]" />
          <div className="absolute bottom-4 h-16 w-20 rounded-[8px] border border-white/10 bg-black/30" />
          <Gift className="relative text-white drop-shadow-[0_10px_20px_rgba(0,0,0,.65)]" size={42} />
          <p className="absolute bottom-2 text-[11px] font-black text-white/70">{image}</p>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[.16em] text-white/45"><Sparkles size={13} />{hot ? "Hot drop" : type}</div>
          <h3 className="mt-2 truncate text-lg font-black">{name}</h3>
          <p className="mt-1 truncate text-sm text-white/55">Top: {bestDrop.name}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {drops.slice(0, 3).map((drop) => <span key={drop.id} className={`rarity-${drop.rarity.toLowerCase()} rounded-full bg-white/[.06] px-2 py-1 text-[11px] font-bold`} style={{ color: "var(--rarity)" }}>{drop.value} TON</span>)}
          </div>
        </div>
      </div>

      <button onClick={onOpen} className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#1683ff] text-sm font-black text-white shadow-[0_16px_40px_rgba(22,131,255,.25)] transition hover:brightness-110">
        Open for {price} TON
      </button>
    </motion.article>
  );
}
