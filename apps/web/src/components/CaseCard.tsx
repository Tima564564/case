"use client";

import { motion } from "framer-motion";
import { Box, Gem, Sparkles } from "lucide-react";
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
    <motion.article
      layout
      whileTap={{ scale: 0.98 }}
      className="glass relative overflow-hidden rounded-[8px] p-3"
    >
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyanGlow to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-cyan-200/70">
            <Sparkles size={14} />
            {hot ? "Hot" : type}
          </div>
          <h3 className="mt-2 truncate text-lg font-black">{name}</h3>
          <p className="mt-1 text-sm text-white/60">Top: {bestDrop.name}</p>
        </div>
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[8px] border border-white/10 bg-gradient-to-br from-cyan-400/20 via-violet-500/20 to-amber-300/20 shadow-neon">
          <div className="text-center">
            <Box className="mx-auto text-cyanGlow" size={20} />
            <p className="mt-1 text-xs font-black">{image}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {drops.slice(0, 4).map((drop) => (
          <div
            key={drop.name}
            className={`rarity-${drop.rarity.toLowerCase()} min-w-0 rounded-[8px] border border-white/10 bg-white/[.045] p-2`}
            style={{ boxShadow: "inset 0 -2px 0 var(--rarity)" }}
          >
            <div className="truncate text-xs text-white/70">{drop.name}</div>
            <div className="mt-1 flex items-center justify-between gap-2 text-xs">
              <span className="font-bold" style={{ color: "var(--rarity)" }}>
                ${drop.value}
              </span>
              <span className="text-white/40">{drop.chance}%</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onOpen}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-cyanGlow text-sm font-black text-slate-950 shadow-[0_0_26px_rgba(0,240,255,.3)] transition hover:brightness-110"
      >
        <Gem size={18} />
        Open ${price}
      </button>
    </motion.article>
  );
}
