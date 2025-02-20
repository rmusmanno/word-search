import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';

interface FileUploadProps {
  onWordsLoaded: (words: string[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onWordsLoaded }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const words = results.data
            .flat()
            .filter((word): word is string => typeof word === 'string' && word.trim().length > 0)
            .map(word => word.trim().toUpperCase());
          onWordsLoaded(words);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          alert('Error parsing CSV file. Please ensure it\'s properly formatted.');
        }
      });
    }
  }, [onWordsLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? 'Drop the CSV file here...'
          : 'Drag & drop a CSV file here, or click to select one'}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        File should contain one word per line or comma-separated values
      </p>
    </div>
  );
};