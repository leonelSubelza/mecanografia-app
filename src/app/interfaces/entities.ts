export interface TextContent {
    title: string;
    text: string;
    letterCount?: number;   
}

export interface Word {
    word: string,
    index: number,
    letterList: Letter[],
    indexLetterActive?: number,
    isActive?: boolean,
    isCompleted: boolean
}

export enum LetterStatus {
    DEFAULT = "DEFAULT",
    CORRECT = "CORRECT",
    INCORRECT = "INCORRECT"
}

export interface Letter {
    letter: string,
    index: number,
    isActive?: boolean,
    status?: LetterStatus
}