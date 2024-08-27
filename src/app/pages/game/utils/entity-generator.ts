import { Letter, LetterStatus, Word } from "../../../interfaces/entities";

export const generateLetterList = (word: string): Letter[] => {
    let letterList: Letter[] = [];
    word.split('').forEach((letter: string,i: number) => {
      letterList.push({
        id: '' + i + letter,
        letter: letter,
        index: i,
        isActive: false,
        status: LetterStatus.DEFAULT,
      });
    });
    return letterList;
  };

  export const generateWord = (word: string,index: number): Word => {
    return {
      id: '' + index + word,
      word: word,
      index: index,
      letterList: generateLetterList(word),
      indexLetterActive: 0,
      isActive: false,
      isCompleted: false,
    };
  };