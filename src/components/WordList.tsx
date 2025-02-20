import React from 'react';
import { List } from 'lucide-react';

interface WordListProps {
  words: string[];
}

export const WordList: React.FC<WordListProps> = ({ words }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <List className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold">Word List</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {words.map((word, index) => (
          <div
            key={index}
            className="px-3 py-1 bg-gray-100 rounded text-sm font-medium text-gray-700"
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
};