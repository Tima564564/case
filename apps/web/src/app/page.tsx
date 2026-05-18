"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  CheckCircle2,
  Crown,
  Gift,
  HomeIcon,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  Wallet
} from "lucide-react";
import { CaseCard } from "../components/CaseCard";
import { LiveFeed } from "../components/LiveFeed";
import { Roulette } from "../components/Roulette";
import { bootTelegramShell, getTelegramWebApp } from "../lib/telegram";
import { battles, cases, inventorySeed, leaders, tasks, type Drop, type GiftCase } from "../lib/mock";

type Tab = "home" | "cases" | "battle" | "inventory" | "tasks";

const tabs: Array<{ id: Tab; label: string; icon: typeof HomeIcon }> = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "cases", label: "Cases", icon: Gift },
  { id: "battle", label: "Battle", icon: Swords },
  { id: "inventory", label: "Bag", icon: Wallet },
  { id: "tasks", label: "Tasks", icon: CheckCircle2 }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [balance, setBalance] = useState(1284.7);
  const [activeCase, setActiveCase] = useState<GiftCase | null>(null);
  const [result, setResult] = useState<Drop | undefined>();
  const [ownedItems, setOwnedItems] = useState<Drop[]>(inventorySeed);
  const [claimedTasks, setClaimedTasks] = useState<string[]>([]);
  const [toast, setToast] = useState("Ready for Telegram gifts");

  const inventoryValue = useMemo(() => ownedItems.reduce((sum, item) => sum + item.value, 0), [ownedItems]);

  useEffect(() => {
    bootTelegramShell();
  }, []);

  function pickDrop(nextCase: GiftCase) {
    const total = nextCase.drops.reduce((sum, drop) => sum + drop.chance, 0);
    let roll = Math.random() * total;
    for (const drop of nextCase.drops) {
      roll -= drop.chance;
      if (roll <= 0) return drop;
    }
    return nextCase.drops[0];
  }

  function openCase(nextCase: GiftCase) {
    if (balance < nextCase.price) {
      setToast("Not enough balance");
      getTelegramWebApp()?.HapticFeedback?.notificationOccurred?.("warning");
      return;
    }

    const won = { ...pickDrop(nextCase), id: `${nextCase.id}-${Date.now()}` };
    setBalance((current) => Number((current - nextCase.price).toFixed(2)));
    setOwnedItems((current) => [won, ...current]);
    setResult(won);
    setActiveCase(nextCase);
    setToast(`Opened ${nextCase.name}`);
    getTelegramWebApp()?.HapticFeedback?.impactOccurred?.("medium");
  }

  function sellItem(item: Drop) {
    setOwnedItems((current) => current.filter((owned) => owned.id !== item.id));
    setBalance((current) => Number((current + item.value * 0.82).toFixed(2)));
    setToast(`Sold ${item.name}`);
    getTelegramWebApp()?.HapticFeedback?.notificationOccurred?.("success");
  }

  function sellResult() {
    if (result) sellItem(result);
    setActiveCase(null);
  }

  function claimTask(taskId: string, reward: number) {
    if (claimedTasks.includes(taskId)) return;
    setClaimedTasks((current) => [...current, taskId]);
    setBalance((current) => Number((current + reward).toFixed(2)));
    setToast(`Reward claimed: $${reward}`);
  }

  function joinBattle(title: string) {
    setToast(`Joined ${title}`);
    setActiveTab("battle");
    getTelegramWebApp()?.HapticFeedback?.impactOccurred?.("light");
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col overflow-x-hidden px-3 pb-24 pt-3">
      <header className="sticky top-0 z-40 -mx-3 border-b border-white/10 bg-ink/90 px-3 py-3 backdrop-blur-glass">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs uppercase tracking-[.18em] text-cyan-200/70">Telegram Gift Cases</p>
            <h1 className="truncate text-2xl font-black leading-tight">Case Royale</h1>
          </div>
          <button
            onClick={() => setToast("Notifications enabled in Telegram")}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] border border-white/10 bg-white/[.06] text-cyanGlow"
            aria-label="Notifications"
          >
            <Bell size={19} />
          </button>
        </div>
      </header>

      <motion.div
        key={toast}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-[8px] border border-cyan-200/20 bg-cyan-200/10 px-3 py-2 text-sm text-cyan-50"
      >
        {toast}
      </motion.div>

      {activeTab === "home" ? (
        <>
          <Hero balance={balance} inventoryValue={inventoryValue} setActiveTab={setActiveTab} />
          <section className="mt-5">
            <SectionTitle title="Hot Telegram cases" action="All" onAction={() => setActiveTab("cases")} />
            <div className="grid gap-3">
              {cases.slice(0, 2).map((caseItem) => (
                <CaseCard key={caseItem.id} {...caseItem} onOpen={() => openCase(caseItem)} />
              ))}
            </div>
          </section>
          <section className="mt-5">
            <LiveFeed />
          </section>
          <Leaderboard />
        </>
      ) : null}

      {activeTab === "cases" ? (
        <section className="mt-5">
          <SectionTitle title="Gift cases" action="Balance" onAction={() => setActiveTab("home")} />
          <div className="grid gap-3">
            {cases.map((caseItem) => (
              <CaseCard key={caseItem.id} {...caseItem} onOpen={() => openCase(caseItem)} />
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "battle" ? (
        <section className="mt-5">
          <SectionTitle title="PvP battles" action="Create" onAction={() => setToast("Battle room created")} />
          <div className="grid gap-3">
            {battles.map((battle) => (
              <article key={battle.id} className="glass rounded-[8px] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[.16em] text-cyan-200/70">{battle.status}</p>
                    <h3 className="mt-1 text-lg font-black">{battle.title}</h3>
                    <p className="mt-1 text-sm text-white/50">{battle.players} players</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/50">Pot</p>
                    <p className="text-xl font-black text-cyanGlow">${battle.pot}</p>
                  </div>
                </div>
                <button onClick={() => joinBattle(battle.title)} className="mt-4 h-11 w-full rounded-[8px] bg-white text-sm font-black text-slate-950">
                  {battle.status === "Live" ? "Watch live" : "Join battle"}
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "inventory" ? (
        <section className="mt-5">
          <SectionTitle title="Inventory" action={`$${inventoryValue}`} onAction={() => setToast("Inventory value")} />
          <div className="grid grid-cols-2 gap-3">
            {ownedItems.map((item) => (
              <InventoryCard key={item.id} item={item} onSell={() => sellItem(item)} />
            ))}
          </div>
          {ownedItems.length === 0 ? <EmptyState text="No gifts yet. Open a case first." /> : null}
        </section>
      ) : null}

      {activeTab === "tasks" ? (
        <section className="mt-5">
          <SectionTitle title="Rewards" action="Referral" onAction={() => setToast("Invite link copied")} />
          <div className="grid gap-3">
            {tasks.map((task) => {
              const claimed = claimedTasks.includes(task.id);
              return (
                <article key={task.id} className="glass flex items-center justify-between gap-3 rounded-[8px] p-4">
                  <div>
                    <h3 className="font-black">{task.title}</h3>
                    <p className="mt-1 text-sm text-white/50">Reward ${task.reward}</p>
                  </div>
                  <button
                    onClick={() => claimTask(task.id, task.reward)}
                    className={`h-10 rounded-[8px] px-4 text-sm font-black ${claimed ? "bg-white/10 text-white/40" : "bg-cyanGlow text-slate-950"}`}
                  >
                    {claimed ? "Done" : "Claim"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t border-white/10 bg-ink/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-glass">
        <div className="grid grid-cols-5 gap-1">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`grid h-12 place-items-center rounded-[8px] text-[11px] font-bold transition ${active ? "bg-cyanGlow text-slate-950" : "text-white/60 hover:bg-white/[.06] hover:text-white"}`}
              >
                <Icon size={17} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <Roulette
        isOpen={Boolean(activeCase)}
        items={activeCase?.drops ?? []}
        result={result}
        onClose={() => setActiveCase(null)}
        onSell={sellResult}
      />
    </main>
  );
}

function Hero({
  balance,
  inventoryValue,
  setActiveTab
}: {
  balance: number;
  inventoryValue: number;
  setActiveTab: (tab: Tab) => void;
}) {
  return (
    <section className="mt-4 overflow-hidden rounded-[8px] border border-cyan-200/20 bg-[linear-gradient(135deg,rgba(0,240,255,.18),rgba(155,92,255,.14)_48%,rgba(255,189,74,.16))] p-4 shadow-neon">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-white/70">Balance</p>
          <div className="mt-1 flex items-center gap-2">
            <Wallet className="shrink-0 text-cyanGlow" size={20} />
            <span className="truncate text-3xl font-black">${balance.toFixed(2)}</span>
          </div>
          <p className="mt-3 text-sm text-white/60">Open Telegram gifts, Stars, Premium and TON cases.</p>
        </div>
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-[8px] border border-white/10 bg-black/25 shadow-mythic">
          <Gift className="text-cyanGlow" size={34} />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <HeroButton icon={ShieldCheck} label="Fair" onClick={() => setActiveTab("tasks")} />
        <HeroButton icon={Swords} label="Battle" onClick={() => setActiveTab("battle")} />
        <HeroButton icon={Crown} label={`Bag $${inventoryValue}`} onClick={() => setActiveTab("inventory")} />
      </div>
    </section>
  );
}

function HeroButton({ icon: Icon, label, onClick }: { icon: typeof HomeIcon; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex h-11 min-w-0 items-center justify-center gap-1 rounded-[8px] border border-white/10 bg-black/20 px-1 text-xs font-bold">
      <Icon size={15} />
      <span className="truncate">{label}</span>
    </button>
  );
}

function SectionTitle({ title, action, onAction }: { title: string; action: string; onAction: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-lg font-black">{title}</h2>
      <button onClick={onAction} className="flex shrink-0 items-center gap-1 text-sm font-bold text-cyanGlow">
        <BarChart3 size={16} />
        {action}
      </button>
    </div>
  );
}

function InventoryCard({ item, onSell }: { item: Drop; onSell: () => void }) {
  return (
    <article className={`rarity-${item.rarity.toLowerCase()} rounded-[8px] border border-white/10 bg-white/[.045] p-3`} style={{ boxShadow: "inset 0 -3px 0 var(--rarity)" }}>
      <div className="grid h-16 place-items-center rounded-[8px] bg-black/25">
        <Sparkles size={24} style={{ color: "var(--rarity)" }} />
      </div>
      <h3 className="mt-3 truncate text-sm font-black">{item.name}</h3>
      <p className="mt-1 text-xs text-white/50">{item.tag}</p>
      <button onClick={onSell} className="mt-3 h-9 w-full rounded-[8px] border border-white/10 bg-white/[.06] text-xs font-bold">
        Sell ${Math.round(item.value * 0.82)}
      </button>
    </article>
  );
}

function Leaderboard() {
  return (
    <section className="mt-5">
      <SectionTitle title="Leaderboard" action="Season" onAction={() => undefined} />
      <div className="glass rounded-[8px] p-3">
        {leaders.map((leader, index) => (
          <div key={leader.user} className="flex items-center justify-between gap-3 border-b border-white/10 py-3 last:border-0">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-white/[.06] text-cyanGlow">
                {index === 0 ? <Trophy size={18} /> : index + 1}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black">@{leader.user}</p>
                <p className="truncate text-xs text-white/50">{leader.best}</p>
              </div>
            </div>
            <p className="shrink-0 text-sm font-bold">${leader.volume}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="glass mt-3 rounded-[8px] p-4 text-center text-sm text-white/50">{text}</div>;
}
