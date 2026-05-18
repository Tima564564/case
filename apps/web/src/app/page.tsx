"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Bell, Crown, ShieldCheck, Swords, Wallet } from "lucide-react";
import { CaseCard } from "@/components/CaseCard";
import { LiveFeed } from "@/components/LiveFeed";
import { Roulette } from "@/components/Roulette";
import { bootTelegramShell, getTelegramWebApp } from "@/lib/telegram";
import { cases } from "@/lib/mock";

const statActions = [
  { label: "Fair", icon: ShieldCheck },
  { label: "Battles", icon: Swords },
  { label: "Top", icon: Crown }
];

export default function Home() {
  const [activeCase, setActiveCase] = useState<(typeof cases)[number] | null>(null);
  const [resultIndex, setResultIndex] = useState(0);
  const result = useMemo(() => activeCase?.drops[resultIndex], [activeCase, resultIndex]);

  useEffect(() => {
    bootTelegramShell();
  }, []);

  function openCase(nextCase: (typeof cases)[number]) {
    getTelegramWebApp()?.HapticFeedback?.impactOccurred?.("medium");
    setActiveCase(nextCase);
    setResultIndex(Math.floor(Math.random() * nextCase.drops.length));
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-3 pb-24 pt-4">
      <header className="sticky top-0 z-40 -mx-3 border-b border-white/10 bg-ink/80 px-3 py-3 backdrop-blur-glass">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">Telegram Mini App</p>
            <h1 className="text-2xl font-black leading-tight">Case Royale</h1>
          </div>
          <button className="grid h-11 w-11 place-items-center rounded-[8px] border border-white/10 bg-white/[.06] text-cyanGlow">
            <Bell size={19} />
          </button>
        </div>
      </header>

      <section className="mt-4 overflow-hidden rounded-[8px] border border-cyan-200/20 bg-[linear-gradient(135deg,rgba(0,240,255,.18),rgba(155,92,255,.14)_48%,rgba(255,189,74,.16))] p-4 shadow-neon">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/70">Balance</p>
            <div className="mt-1 flex items-center gap-2">
              <Wallet className="text-cyanGlow" size={20} />
              <span className="text-3xl font-black">$1,284.70</span>
            </div>
            <p className="mt-3 max-w-[260px] text-sm text-white/60">Open cases, upgrade items, enter battles, and cash out crypto rewards.</p>
          </div>
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-[8px] border border-white/10 bg-black/24 text-4xl font-black shadow-mythic">
            CR
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {statActions.map(({ label, icon: Icon }) => (
            <button key={label} className="flex h-11 items-center justify-center gap-2 rounded-[8px] border border-white/10 bg-black/20 text-sm font-bold">
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black">Popular cases</h2>
          <button className="flex items-center gap-1 text-sm font-bold text-cyanGlow">
            <BarChart3 size={16} />
            Stats
          </button>
        </div>
        <div className="grid gap-3">
          {cases.map((caseItem) => (
            <CaseCard key={caseItem.id} {...caseItem} onOpen={() => openCase(caseItem)} />
          ))}
        </div>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3">
        <div className="glass rounded-[8px] p-4">
          <p className="text-sm text-white/60">Inventory value</p>
          <p className="mt-1 text-2xl font-black">$642</p>
          <p className="mt-2 text-xs text-emerald-300">+18.4% today</p>
        </div>
        <div className="glass rounded-[8px] p-4">
          <p className="text-sm text-white/60">Win rate</p>
          <p className="mt-1 text-2xl font-black">62%</p>
          <p className="mt-2 text-xs text-cyan-200">PvP season</p>
        </div>
      </section>

      <section className="mt-5">
        <LiveFeed />
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[520px] border-t border-white/10 bg-ink/90 px-3 py-2 backdrop-blur-glass">
        <div className="grid grid-cols-5 gap-2">
          {["Home", "Cases", "Battle", "Tasks", "Admin"].map((item) => (
            <button key={item} className="h-11 rounded-[8px] text-xs font-bold text-white/70 transition hover:bg-white/[.06] hover:text-white">
              {item}
            </button>
          ))}
        </div>
      </nav>

      <AnimatePresence>
        <Roulette
          isOpen={Boolean(activeCase)}
          items={activeCase?.drops ?? []}
          result={result}
          onClose={() => setActiveCase(null)}
        />
      </AnimatePresence>
    </main>
  );
}
