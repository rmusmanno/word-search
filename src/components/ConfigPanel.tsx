import React from 'react';
import { Settings } from 'lucide-react';

interface ConfigPanelProps {
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  allowDiagonal: boolean;
  onAllowDiagonalChange: (allow: boolean) => void;
  allowBackwards: boolean;
  onAllowBackwardsChange: (allow: boolean) => void;
  onGenerate: () => void;
  canGenerate: boolean;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  gridSize,
  onGridSizeChange,
  allowDiagonal,
  onAllowDiagonalChange,
  allowBackwards,
  onAllowBackwardsChange,
  onGenerate,
  canGenerate
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Settings className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold">Puzzle Configuration</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grid Size: {gridSize}x{gridSize}
          </label>
          <input
            type="range"
            min="8"
            max="20"
            value={gridSize}
            onChange={(e) => onGridSizeChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowDiagonal"
            checked={allowDiagonal}
            onChange={(e) => onAllowDiagonalChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <label htmlFor="allowDiagonal" className="ml-2 text-sm text-gray-700">
            Allow Diagonal Words
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowBackwards"
            checked={allowBackwards}
            onChange={(e) => onAllowBackwardsChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <label htmlFor="allowBackwards" className="ml-2 text-sm text-gray-700">
            Allow Backwards Words
          </label>
        </div>

        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className={`
            w-full py-2 px-4 rounded-md text-white font-medium
            ${canGenerate
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
            }
          `}
        >
          Generate Puzzle
        </button>
      </div>
    </div>
  );
};