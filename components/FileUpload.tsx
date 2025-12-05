import React, { ChangeEvent } from 'react';
import { FileData } from '../types';

interface FileUploadProps {
  onFileSelect: (fileData: FileData) => void;
  selectedFile: FileData | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile }) => {
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert("Please upload a PDF file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Content = base64String.split(',')[1];
      
      onFileSelect({
        base64: base64Content,
        mimeType: file.type,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <div className={`
        relative border-2 border-dashed rounded-2xl h-44 flex flex-col items-center justify-center text-center transition-all duration-200 group
        ${selectedFile 
          ? 'border-teal-400 bg-teal-50/50' 
          : 'border-stone-300 hover:border-teal-400 hover:bg-stone-50'
        }
      `}>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {selectedFile ? (
          <div className="flex flex-col items-center justify-center text-teal-700 animate-in fade-in zoom-in duration-300">
            <div className="p-3 bg-white rounded-full shadow-md mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-bold text-sm text-stone-800 truncate max-w-[200px]">{selectedFile.name}</span>
            <span className="text-xs text-teal-600 mt-1 font-medium bg-teal-100 px-2 py-0.5 rounded">Ready to scan</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-stone-500">
            <div className="p-3 bg-stone-100 rounded-full mb-3 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <span className="font-semibold text-stone-700">Click to upload</span>
            <span className="text-xs text-stone-400 mt-1">or drag and drop PDF</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;