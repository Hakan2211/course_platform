export type BreathingMode = '4-7-8' | 'physiological-sigh';

export type BreathingPhase =
  | 'idle'
  | 'inhale'
  | 'inhale-short'
  | 'hold'
  | 'exhale';

export interface BreathingConfig {
  inhaleDuration: number;
  inhaleShortDuration?: number; // Only for sigh
  holdDuration: number;
  exhaleDuration: number;
  name: string;
  description: string;
}

export enum CrashState {
  NORMAL = 'normal',
  GUT_SHOCK = 'gut-shock',
  TRANSMITTING = 'transmitting',
  BRAIN_SHOCK = 'brain-shock',
  RECOVERY = 'recovery',
}
