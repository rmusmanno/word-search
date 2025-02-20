import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ConfigPanel } from './components/ConfigPanel';
import { WordGrid } from './components/WordGrid';
import { WordList } from './components/WordList';
import { generateWordSearch } from './utils/wordSearchGenerator';
import { GridCell } from './types';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

function App() {
  const [words, setWords] = useState<string[]>([]);
  const [gridSize, setGridSize] = useState(15);
  const [allowDiagonal, setAllowDiagonal] = useState(true);
  const [allowBackwards, setAllowBackwards] = useState(true);
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [showSolution, setShowSolution] = useState(false);

  const handleWordsLoaded = (newWords: string[]) => {
    setWords(newWords);
    setGrid([]);
  };

  const handleGenerate = () => {
    const newGrid = generateWordSearch({
      gridSize,
      words,
      allowDiagonal,
      allowBackwards
    });
    setGrid(newGrid);
    setShowSolution(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const drawGrid = (startY: number, showSolution: boolean) => {
      const cellSize = 8;
      const startX = 50;
      const dotRadius = 0.25; // Smaller dots
      const dotOffset = cellSize / 3; // Spacing between dots

      // Draw letters first
      grid.forEach((row, i) => {
        row.forEach((cell, j) => {
          doc.setTextColor(0, 0, 0);
          doc.text(
            cell.letter,
            startX + j * cellSize,
            startY + i * cellSize,
            { align: 'center' }
          );
        });
      });

      // If showing solution, draw ellipses for each word
      if (showSolution) {
        // Get unique word placements
        const wordPlacements = new Set<string>();
        grid.forEach((row, i) => {
          row.forEach((cell, j) => {
            if (cell.isPartOfWord) {
              cell.words.forEach(word => {
                // Find all cells for this word
                const wordCells: [number, number][] = [];
                let found = false;
                
                // Check all possible directions from this cell
                const directions = [
                  [0, 1], [1, 0], [1, 1], [1, -1],  // right, down, diagonal down-right, diagonal down-left
                  [0, -1], [-1, 0], [-1, -1], [-1, 1]  // left, up, diagonal up-left, diagonal up-right
                ];

                for (const [dx, dy] of directions) {
                  if (found) break;
                  
                  let cells: [number, number][] = [];
                  let currentRow = i;
                  let currentCol = j;
                  let matchLength = 0;
                  
                  while (
                    currentRow >= 0 && currentRow < gridSize &&
                    currentCol >= 0 && currentCol < gridSize &&
                    matchLength < word.length
                  ) {
                    if (grid[currentRow][currentCol].letter === word[matchLength]) {
                      cells.push([currentRow, currentCol]);
                      matchLength++;
                      if (matchLength === word.length) {
                        found = true;
                        wordCells.push(...cells);
                        break;
                      }
                      currentRow += dx;
                      currentCol += dy;
                    } else {
                      break;
                    }
                  }
                }

                if (wordCells.length > 0) {
                  const key = wordCells.map(([r, c]) => `${r},${c}`).join('|');
                  if (!wordPlacements.has(key)) {
                    wordPlacements.add(key);
                    
                    // Draw ellipses around the word
                    doc.setDrawColor(0, 0, 0);
                    doc.setFillColor(0, 0, 0);
                    
                    wordCells.forEach(([r, c]) => {
                      const x = startX + c * cellSize;
                      const y = startY + r * cellSize;
                      
                      // Draw three dots vertically for each letter
                      doc.circle(x - dotOffset, y, dotRadius, 'F'); // Left dot
                      doc.circle(x, y - dotOffset, dotRadius, 'F'); // Top dot
                      doc.circle(x + dotOffset, y, dotRadius, 'F'); // Right dot
                      doc.circle(x, y + dotOffset, dotRadius, 'F'); // Bottom dot
                    });
                  }
                }
              });
            }
          });
        });
      }
    };

    const addWordList = (startY: number) => {
      doc.setFontSize(14);
      doc.text('Words to Find:', 20, startY);
      
      const wordsPerRow = 3;
      const wordList = words.reduce((acc, word, i) => {
        const row = Math.floor(i / wordsPerRow);
        if (!acc[row]) acc[row] = [];
        acc[row].push(word);
        return acc;
      }, [] as string[][]);

      wordList.forEach((row, i) => {
        doc.text(
          row.join('     '),
          20,
          startY + 15 + (i * 10)
        );
      });
    };

    // First page - Puzzle
    doc.setFontSize(20);
    doc.text('Word Search Puzzle', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    drawGrid(40, false);
    addWordList(40 + grid.length * 8 + 20);

    // Second page - Solution
    doc.addPage();
    
    doc.setFontSize(20);
    doc.text('Word Search Solution', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    drawGrid(40, true);
    addWordList(40 + grid.length * 8 + 20);

    // Save the PDF
    doc.save('word-search.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Word Search Creator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <FileUpload onWordsLoaded={handleWordsLoaded} />
            
            {words.length > 0 && (
              <>
                <ConfigPanel
                  gridSize={gridSize}
                  onGridSizeChange={setGridSize}
                  allowDiagonal={allowDiagonal}
                  onAllowDiagonalChange={setAllowDiagonal}
                  allowBackwards={allowBackwards}
                  onAllowBackwardsChange={setAllowBackwards}
                  onGenerate={handleGenerate}
                  canGenerate={words.length > 0}
                />
                <WordList words={words} />
              </>
            )}
          </div>

          <div className="md:col-span-2">
            {grid.length > 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {showSolution ? 'Solution' : 'Puzzle'}
                  </h2>
                  <div className="space-x-4">
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      {showSolution ? 'Hide Solution' : 'Show Solution'}
                    </button>
                    <button
                      onClick={exportPDF}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 inline-flex items-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <WordGrid grid={grid} showSolution={showSolution} />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Upload a CSV file and configure your puzzle to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;