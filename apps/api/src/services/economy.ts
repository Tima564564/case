export function calculateRtp(revenue: number, payout: number) {
  if (revenue <= 0) return 0;
  return Number((payout / revenue).toFixed(6));
}

export function calculateHouseEdgeFromRtp(rtp: number) {
  return Number(Math.max(0, 1 - rtp).toFixed(6));
}

export function recommendDropRateAction(actualRtp: number, targetRtp: number) {
  const delta = actualRtp - targetRtp;
  if (delta > 0.035) return "tighten_high_value_drops";
  if (delta < -0.035) return "boost_mid_value_drops";
  return "hold";
}

export function scoreWithdrawalRisk(input: { riskScore: number; amount: number; accountAgeHours: number; depositVolume: number }) {
  let score = input.riskScore;
  if (input.amount > input.depositVolume * 0.75) score += 25;
  if (input.accountAgeHours < 48) score += 20;
  if (input.amount > 250) score += 15;
  return Math.min(100, score);
}
