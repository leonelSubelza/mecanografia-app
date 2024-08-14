export interface TextContent {
    title: string;
    text: string;
    letterCount?: number;   
}

export interface Word {
    word: string,
    letterList: Letter[],
    indexLetterActive?: number,
    isActive?: boolean
}

export enum LetterStatus {
    DEFAULT = "DEFAULT",
    CORRECT = "CORRECT",
    INCORRECT = "INCORRECT"
}

export interface Letter {
    letter: string,
    isActive?: boolean,
    status?: LetterStatus
}