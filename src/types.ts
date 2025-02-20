export interface WordSearchConfig {
  gridSize: number;
  words: string[];
  allowDiagonal: boolean;
  allowBackwards: boolean;
}

export interface GridCell {
  letter: string;
  isPartOfWord: boolean;
  words: string[];
  position: {
    row: number;
    col: number;
  };
}

export interface WordPlacement {
  word: string;
  startPos: [number, number];
  direction: [number, number];
}