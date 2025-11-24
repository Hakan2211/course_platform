export type RiskLevel = 'safe' | 'caution' | 'danger' | 'extreme';

export interface PresetConfig {
  name: string;
  risk: number;
  winRate: number;
  rr: number;
  description: string;
}

export interface SimulationStats {
  riskOfRuinProb: number;
  survivalTradeCount: number;
  expectedValue: number;
  riskLevel: RiskLevel;
}

export interface SimulationPoint {
  trade: number;
  balance: number;
}

export interface SimulationResult {
  runId: number;
  path: SimulationPoint[];
  survived: boolean;
  tradesSurvived: number;
}
