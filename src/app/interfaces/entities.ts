export interface TextContent {
  title?: string;
  text: string;
  letterCount?: number;
}

export interface Word {
  id: string;
  word: string;
  index: number;
  letterList: Letter[];
  indexLetterActive?: number;
  isActive?: boolean;
  isCompleted: boolean;
}

export enum LetterStatus {
  DEFAULT = 'DEFAULT',
  CORRECT = 'CORRECT',
  INCORRECT = 'INCORRECT',
}

export interface Letter {
  id: string;
  letter: string;
  index: number;
  isActive?: boolean;
  status?: LetterStatus;
}

export interface Stats {
  username: string;
  theme?: 'light' | 'dark';
  sound: boolean;
  normalMode?: {
    bestTextContent: TextContent;
    bestTime: string;
    bestAccuracy: number;
    cpm: number;
  };
  sprintMode?: {
    bestScore: number;
    totalWordsWritten: number,
    cpm: number,
  };
}

export enum GameMode {
  PRECISION_MODE = 'PRECISION_MODE',
  SPRINT_MODE = 'SPRINT_MODE',
}

export interface ScoreToShow {
  message: string;
  type: 'perfect' | 'normal';
}