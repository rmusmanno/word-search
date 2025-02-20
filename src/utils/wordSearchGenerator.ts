import { WordSearchConfig, GridCell, WordPlacement } from '../types';

export function generateWordSearch(config: WordSearchConfig): GridCell[][] {
  const { gridSize, words, allowDiagonal, allowBackwards } = config;
  const grid: GridCell[][] = Array(gridSize).fill(null).map((_, row) =>
    Array(gridSize).fill(null).map((_, col) => ({
      letter: '',
      isPartOfWord: false,
      words: [],
      position: { row, col }
    }))
  );

  const placements: WordPlacement[] = [];
  const directions = getAllowedDirections(allowDiagonal, allowBackwards);

  // Sort words by length (longest first)
  const sortedWords = [...words].sort((a, b) => b.length - a.length);

  for (const word of sortedWords) {
    let placed = false;
    const attempts = 100; // Maximum attempts to place each word

    for (let attempt = 0; attempt < attempts && !placed; attempt++) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const startPos: [number, number] = [
        Math.floor(Math.random() * gridSize),
        Math.floor(Math.random() * gridSize)
      ];

      if (canPlaceWord(grid, word, startPos, direction, gridSize)) {
        placeWord(grid, word, startPos, direction);
        placements.push({ word, startPos, direction });
        placed = true;
      }
    }

    if (!placed) {
      console.warn(`Could not place word: ${word}`);
    }
  }

  // Fill empty cells with random letters
  fillEmptyCells(grid);

  return grid;
}

function getAllowedDirections(allowDiagonal: boolean, allowBackwards: boolean): [number, number][] {
  const directions: [number, number][] = [
    [0, 1],   // right
    [1, 0],   // down
  ];

  if (allowDiagonal) {
    directions.push(
      [1, 1],   // diagonal down-right
      [1, -1],  // diagonal down-left
    );
  }

  if (allowBackwards) {
    directions.push(
      [0, -1],  // left
      [-1, 0],  // up
    );
    if (allowDiagonal) {
      directions.push(
        [-1, -1], // diagonal up-left
        [-1, 1],  // diagonal up-right
      );
    }
  }

  return directions;
}

function canPlaceWord(
  grid: GridCell[][],
  word: string,
  startPos: [number, number],
  direction: [number, number],
  gridSize: number
): boolean {
  const [row, col] = startPos;
  const [dRow, dCol] = direction;

  // Check if word fits within grid bounds
  if (
    row + (word.length - 1) * dRow >= gridSize ||
    row + (word.length - 1) * dRow < 0 ||
    col + (word.length - 1) * dCol >= gridSize ||
    col + (word.length - 1) * dCol < 0
  ) {
    return false;
  }

  // Check if word can be placed without conflicts
  for (let i = 0; i < word.length; i++) {
    const currentRow = row + i * dRow;
    const currentCol = col + i * dCol;
    const cell = grid[currentRow][currentCol];

    if (cell.letter !== '' && cell.letter !== word[i]) {
      return false;
    }
  }

  return true;
}

function placeWord(
  grid: GridCell[][],
  word: string,
  startPos: [number, number],
  direction: [number, number]
): void {
  const [row, col] = startPos;
  const [dRow, dCol] = direction;

  for (let i = 0; i < word.length; i++) {
    const currentRow = row + i * dRow;
    const currentCol = col + i * dCol;
    const cell = grid[currentRow][currentCol];

    cell.letter = word[i].toUpperCase();
    cell.isPartOfWord = true;
    cell.words.push(word);
  }
}

function fillEmptyCells(grid: GridCell[][]): void {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col].letter === '') {
        grid[row][col].letter = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}