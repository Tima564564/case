import { Radio } from "lucide-react";
import { liveFeed } from "@/lib/mock";

export function LiveFeed() {
  return (
    <section className="glass rounded-[8px] p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Radio size={16} className="text-cyanGlow" />
          Live openings
        </div>
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.9)]" />
      </div>
      <div className="space-y-2">
        {liveFeed.map((entry) => (
          <div key={`${entry.user}-${entry.item}`} className="flex items-center justify-between rounded-[8px] bg-white/[.045] px-3 py-2 text-sm">
            <span className="text-white/60">@{entry.user}</span>
            <span className="font-bold">{entry.item}</span>
            <span className="text-cyan-200">${entry.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
