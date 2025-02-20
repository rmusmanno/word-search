import React from 'react';
import { GridCell } from '../types';

interface WordGridProps {
  grid: GridCell[][];
  showSolution?: boolean;
}

export const WordGrid: React.FC<WordGridProps> = ({ grid, showSolution = false }) => {
  return (
    <div className="inline-block border border-gray-300 rounded-lg overflow-hidden bg-white">
      <table className="border-collapse">
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-10 h-10 text-center border border-gray-200
                    ${showSolution && cell.isPartOfWord ? 'bg-yellow-100' : ''}
                    font-mono text-lg select-none
                  `}
                >
                  {cell.letter}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};