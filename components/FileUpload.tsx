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
      // Remove data url prefix (e.g., "data:application/pdf;base64,")
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
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Upload Resume (PDF)
      </label>
      <div className={`
        relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
        ${selectedFile ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
      `}>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {selectedFile ? (
          <div className="flex flex-col items-center justify-center text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-lg truncate max-w-xs">{selectedFile.name}</span>
            <span className="text-xs text-indigo-400 mt-1">Click to replace</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="font-medium">Click to upload or drag and drop</span>
            <span className="text-xs text-slate-400 mt-1">PDF only, max 5MB</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
