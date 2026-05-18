"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Bell, Crown, Gift, Globe2, HomeIcon, Languages, Send, ShieldCheck, ShoppingBag, Sparkles, Swords, Trophy, Wallet, Zap } from "lucide-react";
import { CaseCard } from "../components/CaseCard";
import { LiveFeed } from "../components/LiveFeed";
import { Roulette } from "../components/Roulette";
import { bootTelegramShell, getTelegramWebApp } from "../lib/telegram";
import { battles, cases, economyStats, inventorySeed, leaders, marketplaceListings, starsPacks, tasks, vipTiers, type Drop, type GiftCase } from "../lib/mock";

type Tab = "home" | "cases" | "battle" | "market" | "wallet" | "vip";
type Locale = "en" | "ru" | "ua";

const copy = {
  en: { title: "Case Royale", subtitle: "Telegram Gift Cases", ready: "Ready for Telegram gifts", balance: "Balance", hero: "Open Telegram gifts, Stars, Premium and TON cases.", hotCases: "Hot Telegram cases", all: "All", giftCases: "Gift cases", battle: "Battle", market: "Market", wallet: "Wallet", vip: "VIP", cases: "Cases", home: "Home", open: "Opened", notEnough: "Not enough balance", sold: "Sold", notifications: "Notifications enabled in Telegram", rewards: "Rewards", claim: "Claim", done: "Done", joined: "Joined", inventory: "Inventory", marketplace: "Gift marketplace", buy: "Buy", fusion: "Fusion", tonConnect: "Connect TON", starsPacks: "Telegram Stars packs", depositBonus: "Deposit bonus", dailyFree: "Daily free case", jackpot: "Jackpot", online: "online", rtp: "Public RTP", houseEdge: "House edge", streak: "Streak", referral: "Referral cashback" },
  ru: { title: "Case Royale", subtitle: "Кейсы Telegram Gifts", ready: "Готово к Telegram gifts", balance: "Баланс", hero: "Открывай Telegram Gifts, Stars, Premium и TON кейсы.", hotCases: "Горячие Telegram кейсы", all: "Все", giftCases: "Gift кейсы", battle: "Битвы", market: "Маркет", wallet: "Кошелек", vip: "VIP", cases: "Кейсы", home: "Главная", open: "Открыт", notEnough: "Недостаточно баланса", sold: "Продано", notifications: "Уведомления включены в Telegram", rewards: "Награды", claim: "Забрать", done: "Готово", joined: "Вход в", inventory: "Инвентарь", marketplace: "Маркет подарков", buy: "Купить", fusion: "Слияние", tonConnect: "Подключить TON", starsPacks: "Паки Telegram Stars", depositBonus: "Бонус депозита", dailyFree: "Бесплатный кейс", jackpot: "Джекпот", online: "онлайн", rtp: "Публичный RTP", houseEdge: "House edge", streak: "Серия", referral: "Кэшбек рефералов" },
  ua: { title: "Case Royale", subtitle: "Кейси Telegram Gifts", ready: "Готово до Telegram gifts", balance: "Баланс", hero: "Відкривай Telegram Gifts, Stars, Premium і TON кейси.", hotCases: "Гарячі Telegram кейси", all: "Усі", giftCases: "Gift кейси", battle: "Битви", market: "Маркет", wallet: "Гаманець", vip: "VIP", cases: "Кейси", home: "Головна", open: "Відкрито", notEnough: "Недостатньо балансу", sold: "Продано", notifications: "Сповіщення увімкнено в Telegram", rewards: "Нагороди", claim: "Забрати", done: "Готово", joined: "Вхід у", inventory: "Інвентар", marketplace: "Маркет подарунків", buy: "Купити", fusion: "Злиття", tonConnect: "Підключити TON", starsPacks: "Паки Telegram Stars", depositBonus: "Бонус депозиту", dailyFree: "Безкоштовний кейс", jackpot: "Джекпот", online: "онлайн", rtp: "Публічний RTP", houseEdge: "House edge", streak: "Серія", referral: "Кешбек рефералів" }
} as const;

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const t = copy[locale];
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [balance, setBalance] = useState(1284.7);
  const [activeCase, setActiveCase] = useState<GiftCase | null>(null);
  const [result, setResult] = useState<Drop | undefined>();
  const [ownedItems, setOwnedItems] = useState<Drop[]>(inventorySeed);
  const [claimedTasks, setClaimedTasks] = useState<string[]>([]);
  const [toast, setToast] = useState(t.ready);
  const [tonConnected, setTonConnected] = useState(false);
  const [streak, setStreak] = useState(5);
  const inventoryValue = useMemo(() => ownedItems.reduce((sum, item) => sum + item.value, 0), [ownedItems]);
  const bigWin = result && result.value >= 100;

  useEffect(() => { bootTelegramShell(); }, []);
  useEffect(() => { setToast(copy[locale].ready); }, [locale]);

  function pickDrop(nextCase: GiftCase) {
    const total = nextCase.drops.reduce((sum, drop) => sum + drop.chance, 0);
    let roll = Math.random() * total;
    for (const drop of nextCase.drops) { roll -= drop.chance; if (roll <= 0) return drop; }
    return nextCase.drops[0];
  }

  function openCase(nextCase: GiftCase) {
    if (balance < nextCase.price) { setToast(t.notEnough); getTelegramWebApp()?.HapticFeedback?.notificationOccurred?.("warning"); return; }
    const won = { ...pickDrop(nextCase), id: `${nextCase.id}-${Date.now()}` };
    setBalance((current) => Number((current - nextCase.price).toFixed(2)));
    setOwnedItems((current) => [won, ...current]);
    setResult(won);
    setActiveCase(nextCase);
    setToast(`${t.open} ${nextCase.name}`);
    getTelegramWebApp()?.HapticFeedback?.impactOccurred?.("medium");
  }

  function sellItem(item: Drop) {
    setOwnedItems((current) => current.filter((owned) => owned.id !== item.id));
    setBalance((current) => Number((current + item.value * 0.82).toFixed(2)));
    setToast(`${t.sold} ${item.name}`);
  }

  function claimTask(taskId: string, reward: number) {
    if (claimedTasks.includes(taskId)) return;
    setClaimedTasks((current) => [...current, taskId]);
    setBalance((current) => Number((current + reward).toFixed(2)));
    setStreak((current) => current + 1);
    setToast(`+${reward} ${t.rewards}`);
  }

  function buyListing(price: number, title: string) {
    if (balance < price) { setToast(t.notEnough); return; }
    setBalance((current) => Number((current - price).toFixed(2)));
    setToast(`${t.buy}: ${title}`);
  }

  function buyStarsPack(price: number, title: string, bonus: number) {
    setBalance((current) => Number((current + price + bonus).toFixed(2)));
    setToast(`${title} +${bonus}% ${t.depositBonus}`);
  }

  const nav = [
    { id: "home" as Tab, label: t.home, icon: HomeIcon },
    { id: "cases" as Tab, label: t.cases, icon: Gift },
    { id: "battle" as Tab, label: t.battle, icon: Swords },
    { id: "market" as Tab, label: t.market, icon: ShoppingBag },
    { id: "wallet" as Tab, label: t.wallet, icon: Wallet }
  ];

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col overflow-x-hidden px-3 pb-24 pt-3">
      <header className="sticky top-0 z-40 -mx-3 border-b border-white/10 bg-ink/90 px-3 py-3 backdrop-blur-glass">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0"><p className="truncate text-xs uppercase tracking-[.18em] text-cyan-200/70">{t.subtitle}</p><h1 className="truncate text-2xl font-black leading-tight">{t.title}</h1></div>
          <div className="flex shrink-0 gap-2"><button onClick={() => setActiveTab("vip")} className="grid h-11 w-11 place-items-center rounded-[8px] border border-white/10 bg-white/[.06] text-legendary" aria-label="VIP"><Crown size={19} /></button><button onClick={() => setToast(t.notifications)} className="grid h-11 w-11 place-items-center rounded-[8px] border border-white/10 bg-white/[.06] text-cyanGlow" aria-label="Notifications"><Bell size={19} /></button></div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">{(["en", "ru", "ua"] as Locale[]).map((lang) => <button key={lang} onClick={() => setLocale(lang)} className={`h-9 rounded-[8px] border border-white/10 text-xs font-black uppercase ${locale === lang ? "bg-cyanGlow text-slate-950" : "bg-white/[.04] text-white/70"}`}><Languages className="mr-1 inline" size={13} />{lang}</button>)}</div>
      </header>

      <motion.div key={toast} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-[8px] border border-cyan-200/20 bg-cyan-200/10 px-3 py-2 text-sm text-cyan-50">{toast}</motion.div>
      {bigWin ? <motion.section initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rarity-mythic mt-3 rounded-[8px] border border-white/10 bg-mythic/10 p-4 text-center shadow-mythic"><p className="text-xs uppercase tracking-[.2em] text-white/60">Big win</p><h2 className="mt-1 text-2xl font-black" style={{ color: "var(--rarity)" }}>{result.name}</h2></motion.section> : null}

      {activeTab === "home" ? <><Hero t={t} balance={balance} inventoryValue={inventoryValue} setActiveTab={setActiveTab} online={economyStats.online} streak={streak} /><StatsStrip t={t} /><section className="mt-5"><SectionTitle title={t.hotCases} action={t.all} onAction={() => setActiveTab("cases")} /><div className="grid gap-3">{cases.slice(0, 2).map((caseItem) => <CaseCard key={caseItem.id} {...caseItem} onOpen={() => openCase(caseItem)} />)}</div></section><section className="mt-5"><LiveFeed /></section><Leaderboard /></> : null}
      {activeTab === "cases" ? <section className="mt-5"><SectionTitle title={t.giftCases} action={t.dailyFree} onAction={() => openCase(cases[0])} /><LimitedBanner t={t} /><div className="mt-3 grid gap-3">{cases.map((caseItem) => <CaseCard key={caseItem.id} {...caseItem} onOpen={() => openCase(caseItem)} />)}</div></section> : null}
      {activeTab === "battle" ? <BattleView t={t} setToast={setToast} /> : null}
      {activeTab === "market" ? <section className="mt-5"><SectionTitle title={t.marketplace} action={t.inventory} onAction={() => setActiveTab("vip")} /><div className="grid gap-3">{marketplaceListings.map((listing) => <MarketCard key={listing.id} listing={listing} t={t} onBuy={() => buyListing(listing.price, listing.item)} />)}</div></section> : null}
      {activeTab === "wallet" ? <section className="mt-5"><SectionTitle title={t.wallet} action={tonConnected ? "TON OK" : "TON"} onAction={() => setTonConnected(true)} /><WalletPanel t={t} balance={balance} tonConnected={tonConnected} onConnect={() => setTonConnected(true)} onBuyPack={buyStarsPack} /><Rewards t={t} claimedTasks={claimedTasks} claimTask={claimTask} /></section> : null}
      {activeTab === "vip" ? <section className="mt-5"><SectionTitle title="VIP economy" action={t.fusion} onAction={() => setToast("Fusion lab opened")} /><InventoryGrid items={ownedItems} onSell={sellItem} /><VipPanel t={t} /></section> : null}

      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t border-white/10 bg-ink/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-glass"><div className="grid grid-cols-5 gap-1">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setActiveTab(id)} className={`grid h-12 place-items-center rounded-[8px] text-[10px] font-bold transition ${activeTab === id ? "bg-cyanGlow text-slate-950" : "text-white/60 hover:bg-white/[.06] hover:text-white"}`}><Icon size={17} /><span>{label}</span></button>)}</div></nav>
      <Roulette isOpen={Boolean(activeCase)} items={activeCase?.drops ?? []} result={result} onClose={() => setActiveCase(null)} onSell={() => { if (result) sellItem(result); setActiveCase(null); }} />
    </main>
  );
}

function Hero({ t, balance, inventoryValue, setActiveTab, online, streak }: { t: typeof copy.en; balance: number; inventoryValue: number; setActiveTab: (tab: Tab) => void; online: number; streak: number }) { return <section className="mt-4 overflow-hidden rounded-[8px] border border-cyan-200/20 bg-[linear-gradient(135deg,rgba(0,240,255,.18),rgba(155,92,255,.14)_48%,rgba(255,189,74,.16))] p-4 shadow-neon"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm text-white/70">{t.balance}</p><div className="mt-1 flex items-center gap-2"><Wallet className="shrink-0 text-cyanGlow" size={20} /><span className="truncate text-3xl font-black">${balance.toFixed(2)}</span></div><p className="mt-3 text-sm text-white/60">{t.hero}</p></div><div className="grid h-20 w-20 shrink-0 place-items-center rounded-[8px] border border-white/10 bg-black/25 shadow-mythic"><Gift className="text-cyanGlow" size={34} /></div></div><div className="mt-4 grid grid-cols-3 gap-2"><HeroButton icon={Globe2} label={`${online} ${t.online}`} onClick={() => setActiveTab("market")} /><HeroButton icon={Zap} label={`${t.streak} ${streak}`} onClick={() => setActiveTab("wallet")} /><HeroButton icon={Crown} label={`Bag $${inventoryValue}`} onClick={() => setActiveTab("vip")} /></div></section>; }
function HeroButton({ icon: Icon, label, onClick }: { icon: typeof HomeIcon; label: string; onClick: () => void }) { return <button onClick={onClick} className="flex h-11 min-w-0 items-center justify-center gap-1 rounded-[8px] border border-white/10 bg-black/20 px-1 text-xs font-bold"><Icon size={15} /><span className="truncate">{label}</span></button>; }
function SectionTitle({ title, action, onAction }: { title: string; action: string; onAction: () => void }) { return <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-lg font-black">{title}</h2><button onClick={onAction} className="flex shrink-0 items-center gap-1 text-sm font-bold text-cyanGlow"><BarChart3 size={16} />{action}</button></div>; }
function StatsStrip({ t }: { t: typeof copy.en }) { return <section className="mt-3 grid grid-cols-3 gap-2"><MiniStat title={t.rtp} value={`${economyStats.targetRtp}%`} /><MiniStat title={t.houseEdge} value={`${economyStats.houseEdge}%`} /><MiniStat title={t.jackpot} value={`$${economyStats.jackpotPool}`} /></section>; }
function MiniStat({ title, value }: { title: string; value: string }) { return <div className="glass rounded-[8px] p-3"><p className="truncate text-[11px] text-white/50">{title}</p><p className="mt-1 truncate text-sm font-black">{value}</p></div>; }
function LimitedBanner({ t }: { t: typeof copy.en }) { return <div className="rarity-legendary rounded-[8px] border border-white/10 bg-legendary/10 p-3" style={{ boxShadow: "inset 0 -2px 0 var(--rarity)" }}><p className="text-xs uppercase tracking-[.18em] text-white/50">Limited event</p><h3 className="mt-1 font-black">{t.dailyFree} + seasonal gifts</h3></div>; }
function BattleView({ t, setToast }: { t: typeof copy.en; setToast: (value: string) => void }) { return <section className="mt-5"><SectionTitle title="PvP battles" action="Create" onAction={() => setToast("Battle room created")} /><div className="grid gap-3">{battles.map((battle) => <article key={battle.id} className="glass rounded-[8px] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-[.16em] text-cyan-200/70">{battle.status}</p><h3 className="mt-1 text-lg font-black">{battle.title}</h3><p className="mt-1 text-sm text-white/50">{battle.players} players</p></div><div className="text-right"><p className="text-sm text-white/50">Pot</p><p className="text-xl font-black text-cyanGlow">${battle.pot}</p></div></div><button onClick={() => setToast(`${t.joined} ${battle.title}`)} className="mt-4 h-11 w-full rounded-[8px] bg-white text-sm font-black text-slate-950">{battle.status === "Live" ? "Watch live" : "Join battle"}</button></article>)}</div></section>; }
function MarketCard({ listing, t, onBuy }: { listing: (typeof marketplaceListings)[number]; t: typeof copy.en; onBuy: () => void }) { return <article className={`rarity-${listing.rarity.toLowerCase()} glass rounded-[8px] p-4`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs uppercase tracking-[.16em]" style={{ color: "var(--rarity)" }}>{listing.tag}</p><h3 className="mt-1 truncate text-lg font-black">{listing.item}</h3><p className="mt-1 text-sm text-white/50">@{listing.seller}</p></div><div className="text-right"><p className="text-xl font-black">{listing.price}</p><p className="text-xs text-white/50">{listing.currency}</p></div></div><button onClick={onBuy} className="mt-4 h-11 w-full rounded-[8px] bg-cyanGlow text-sm font-black text-slate-950">{t.buy}</button></article>; }
function WalletPanel({ t, balance, tonConnected, onConnect, onBuyPack }: { t: typeof copy.en; balance: number; tonConnected: boolean; onConnect: () => void; onBuyPack: (price: number, title: string, bonus: number) => void }) { return <div className="grid gap-3"><article className="glass rounded-[8px] p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-white/50">Internal balance</p><h3 className="mt-1 text-2xl font-black">${balance.toFixed(2)}</h3></div><Wallet className="text-cyanGlow" /></div></article><article className="glass rounded-[8px] p-4"><div className="flex items-center justify-between gap-3"><div><h3 className="font-black">TON Connect</h3><p className="mt-1 text-sm text-white/50">{tonConnected ? "Wallet connected" : "Deposits, withdrawals, history"}</p></div><button onClick={onConnect} className="h-10 rounded-[8px] bg-white px-3 text-sm font-black text-slate-950">{tonConnected ? "OK" : t.tonConnect}</button></div></article><SectionTitle title={t.starsPacks} action="XTR" onAction={() => undefined} />{starsPacks.map((pack) => <button key={pack.id} onClick={() => onBuyPack(pack.price, pack.title, pack.bonus)} className="glass flex items-center justify-between rounded-[8px] p-4 text-left"><span><b>{pack.title}</b><span className="ml-2 text-sm text-white/50">+{pack.bonus}%</span></span><span className="font-black">${pack.price}</span></button>)}</div>; }
function Rewards({ t, claimedTasks, claimTask }: { t: typeof copy.en; claimedTasks: string[]; claimTask: (id: string, reward: number) => void }) { return <section className="mt-5"><SectionTitle title={t.rewards} action={t.referral} onAction={() => undefined} /><div className="grid gap-3">{tasks.map((task) => { const claimed = claimedTasks.includes(task.id); return <article key={task.id} className="glass flex items-center justify-between gap-3 rounded-[8px] p-4"><div><h3 className="font-black">{task.title}</h3><p className="mt-1 text-sm text-white/50">Reward ${task.reward}</p></div><button onClick={() => claimTask(task.id, task.reward)} className={`h-10 rounded-[8px] px-4 text-sm font-black ${claimed ? "bg-white/10 text-white/40" : "bg-cyanGlow text-slate-950"}`}>{claimed ? t.done : t.claim}</button></article>; })}</div></section>; }
function InventoryGrid({ items, onSell }: { items: Drop[]; onSell: (item: Drop) => void }) { return <div className="grid grid-cols-2 gap-3">{items.map((item) => <article key={item.id} className={`rarity-${item.rarity.toLowerCase()} rounded-[8px] border border-white/10 bg-white/[.045] p-3`} style={{ boxShadow: "inset 0 -3px 0 var(--rarity)" }}><div className="grid h-16 place-items-center rounded-[8px] bg-black/25"><Sparkles size={24} style={{ color: "var(--rarity)" }} /></div><h3 className="mt-3 truncate text-sm font-black">{item.name}</h3><p className="mt-1 text-xs text-white/50">{item.tag}</p><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => onSell(item)} className="h-9 rounded-[8px] border border-white/10 bg-white/[.06] text-xs font-bold">Sell</button><button onClick={() => undefined} className="h-9 rounded-[8px] border border-white/10 bg-white/[.06] text-xs font-bold"><Send size={13} className="mx-auto" /></button></div></article>)}</div>; }
function VipPanel({ t }: { t: typeof copy.en }) { return <section className="mt-5"><SectionTitle title="VIP levels" action={t.referral} onAction={() => undefined} /><div className="grid gap-2">{vipTiers.map((tier) => <div key={tier.tier} className="glass flex items-center justify-between rounded-[8px] p-3"><div><p className="font-black">{tier.tier}</p><p className="text-xs text-white/50">{tier.cashback}% cashback</p></div><p className="text-sm font-bold text-cyanGlow">{tier.edgeBack}% edge back</p></div>)}</div></section>; }
function Leaderboard() { return <section className="mt-5"><SectionTitle title="Leaderboard" action="Season" onAction={() => undefined} /><div className="glass rounded-[8px] p-3">{leaders.map((leader, index) => <div key={leader.user} className="flex items-center justify-between gap-3 border-b border-white/10 py-3 last:border-0"><div className="flex min-w-0 items-center gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-white/[.06] text-cyanGlow">{index === 0 ? <Trophy size={18} /> : index + 1}</div><div className="min-w-0"><p className="truncate text-sm font-black">@{leader.user}</p><p className="truncate text-xs text-white/50">{leader.best}</p></div></div><p className="shrink-0 text-sm font-bold">${leader.volume}</p></div>)}</div></section>; }
