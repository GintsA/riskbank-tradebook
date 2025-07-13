export interface RiskInput {
  /** Trader's account size in currency units */
  accountSize: number;
  /** Total number of lifetime trades */
  totalTradeCount: number;
  /** Win rate percentage (0-100) */
  winRate: number;
  /** Average reward-to-risk ratio */
  avgRR: number;
}

export interface RiskComputed {
  /** Derived level from trade count */
  level: number;
  /** Personal risk percentage */
  PRP: number;
  /** Experience weight */
  EW: number;
  /** Expected value */
  EV: number;
  /** Adjustment factor */
  AdjF: number;
  /** Raw risk bag */
  RB_raw: number;
  /** Final clamped risk bag */
  RB: number;
}

const LEVEL_THRESHOLDS = [
  0, 10, 30, 50, 75, 100, 150, 200, 300, 450, 600, 800, 1000, 1250, 1500,
];

const K = 0.5;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Maps a trade count to an experience level from 1-15.
 */
export function getLevel(count: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (count >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

/**
 * Computes all risk metrics for a trader profile.
 */
export function computeAll(input: RiskInput): RiskComputed {
  const level = getLevel(input.totalTradeCount);
  const PM = input.winRate;
  const PRP = 0.05 * PM + 0.5;
  const EW = 0.5 + 0.595 * Math.pow(level - 1, 0.756);
  const p = PM / 100;
  const EV = p * input.avgRR - (1 - p);
  const AdjF = 1 + K * Math.max(0, EV);
  const RB_raw = input.accountSize * (PRP / 100) * EW * AdjF;
  const RB = clamp(
    RB_raw,
    5,
    Math.min(0.15 * input.accountSize, 5000)
  );

  return { level, PRP, EW, EV, AdjF, RB_raw, RB };
}