export enum RiskLevel {
  LOW = 'Low Risk',
  MEDIUM = 'Medium Risk',
  HIGH = 'High Risk',
}

export enum SetupType {
  BREAKOUT = 'Breakout',
  MOMENTUM = 'Momentum',
  REVERSAL = 'Reversal',
  STRUCTURE = 'Structure',
  EVENT = 'Event/Special',
}

export enum TimeFrame {
  PRE_MARKET = 'Pre-Market (4-9:30)',
  OPEN = 'Open (9:30-10)',
  MORNING = 'Morning (10-11:30)',
  MIDDAY = 'Midday (11:30-2)',
  POWER_HOUR = 'Power Hour (2-4)',
  MULTI_DAY = 'Multi-Day/Daily',
}

export interface SetupData {
  id: number;
  name: string;
  description: string;
  type: SetupType;
  timeFrame: TimeFrame;
  risk: RiskLevel;
  position: [number, number, number]; // x, y, z coordinates for 3D
  color: string;
}

export interface AxisLabel {
  text: string;
  position: [number, number, number];
  rotation?: [number, number, number];
}

// Timeline Scrubber Types
export type TradeSide = 'Long' | 'Short' | 'Neutral' | 'Both';

export type ScrubberRiskLevel = 'Low' | 'Medium' | 'High';

export interface Setup {
  id: number;
  name: string;
  type: TradeSide;
  description: string;
  startTime: number; // Minutes from midnight (e.g., 9:30 AM = 570)
  endTime: number; // Minutes from midnight
  risk: ScrubberRiskLevel;
  category: string;
}

export interface TimeSegment {
  name: string;
  start: number;
  end: number;
  color: string;
  label: string;
}
