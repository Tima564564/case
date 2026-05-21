"use client";

import { motion } from "framer-motion";
import type { Drop } from "../lib/mock";

type Props = {
  name: string;
  price: number;
  image: string;
  imageUrl: string;
  hot: boolean;
  type: string;
  drops: Drop[];
  onOpen: () => void;
};

export function CaseCard({ name, price, imageUrl, hot, type, drops, onOpen }: Props) {
  const bestDrop = drops.reduce((best, drop) => (drop.value > best.value ? drop : best), drops[0]);

  return (
    <motion.article
      layout
      whileTap={{ scale: 0.985 }}
      className="relative min-h-[226px] overflow-hidden rounded-[14px] border border-[#f0a400]/80 bg-[#1a1a1d] shadow-[0_18px_50px_rgba(0,0,0,.45)]"
    >
      <button onClick={onOpen} className="absolute inset-0 z-30" aria-label={`Open ${name}`} />

      <div className="relative h-[168px] overflow-hidden rounded-b-[14px] bg-[radial-gradient(circle_at_50%_35%,rgba(255,194,74,.24),rgba(27,27,29,.9)_58%,rgba(8,8,10,1))]">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[.06] via-transparent to-black/35" />
        <div className="absolute inset-x-4 bottom-0 h-12 rounded-t-full bg-[#1683ff]/10 blur-xl" />

        {hot ? (
          <div className="absolute left-2 top-2 z-20 rounded-full border border-orange-200 bg-[#ffd247] px-2 py-1 text-[11px] font-black text-[#261200] shadow-[0_8px_20px_rgba(255,188,36,.35)]">
            HOT
          </div>
        ) : null}

        <div className="absolute right-2 top-2 z-20 grid h-7 w-7 place-items-center rounded-full bg-black/45 text-sm font-black text-white/70">
          ?
        </div>

        <motion.img
          src={imageUrl}
          alt={name}
          className="absolute left-1/2 top-7 h-24 w-24 -translate-x-1/2 object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,.68)]"
          animate={{ y: [0, -8, 0], rotate: [-1.5, 1.5, -1.5], scale: [1, 1.04, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs font-black text-white shadow-[0_8px_20px_rgba(0,0,0,.35)]">
          12:26:18
        </div>
      </div>

      <div className="relative flex h-[58px] items-center justify-center gap-2">
        <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span className="text-base font-black">{price}</span>
        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#ffd247] text-[11px] font-black text-[#1d1300]">T</span>
      </div>

      <div className="sr-only">
        {type}. Top prize: {bestDrop.name}. {imageUrl}.
      </div>
    </motion.article>
  );
}
