"use client";

import { motion } from "framer-motion";
import { Gem, Sparkles } from "lucide-react";
import type { Rarity } from "../lib/mock";

type Drop = {
  name: string;
  value: number;
  rarity: Rarity;
};

type Props = {
  name: string;
  price: number;
  image: string;
  hot: boolean;
  drops: Drop[];
  onOpen: () => void;
};

export function CaseCard({ name, price, image, hot, drops, onOpen }: Props) {
  const bestDrop = drops[drops.length - 1];

  return (
    <motion.article
      whileTap={{ scale: 0.98 }}
      className="glass relative overflow-hidden rounded-[8px] p-4"
    >
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyanGlow to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-cyan-200/70">
            <Sparkles size={14} />
            {hot ? "Hot drop" : "Vault"}
          </div>
          <h3 className="mt-2 text-xl font-black">{name}</h3>
          <p className="mt-1 text-sm text-white/60">Top: {bestDrop.name}</p>
        </div>
        <div className="grid h-20 w-20 place-items-center rounded-[8px] border border-white/10 bg-gradient-to-br from-cyan-400/20 via-violet-500/20 to-amber-300/20 text-xl font-black shadow-neon">
          {image}
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-hidden">
        {drops.slice(0, 4).map((drop) => (
          <div
            key={drop.name}
            className={`rarity-${drop.rarity.toLowerCase()} min-w-0 flex-1 rounded-[8px] border border-white/10 bg-white/[.045] p-2`}
            style={{ boxShadow: "inset 0 -2px 0 var(--rarity)" }}
          >
            <div className="truncate text-xs text-white/70">{drop.name}</div>
            <div className="mt-1 text-sm font-bold" style={{ color: "var(--rarity)" }}>
              ${drop.value}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onOpen}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-cyanGlow text-sm font-black text-slate-950 shadow-[0_0_26px_rgba(0,240,255,.3)] transition hover:brightness-110"
      >
        <Gem size={18} />
        Open for ${price}
      </button>
    </motion.article>
  );
}
