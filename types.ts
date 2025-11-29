export interface NameEntry {
  id: string;
  name: string;
  active: boolean;
}

export interface WinnerResult {
  name: string;
  reason?: string; // For AI mode explanation
  missionId?: string; // Futuristic flavor
  index?: number; // The visual index/number of the winner (1-based)
}

export enum PickerMode {
  STANDARD = 'STANDARD',
  AI_ORACLE = 'AI_ORACLE',
  NUMERIC = 'NUMERIC'
}