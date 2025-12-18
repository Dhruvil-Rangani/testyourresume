
import React, { ChangeEvent } from 'react';
import { FileData } from '../types';

interface FileUploadProps {
  onFileSelect: (fileData: FileData) => void;
  selectedFile: FileData | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      onFileSelect({ base64: base64String.split(',')[1], mimeType: file.type, name: file.name });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-44 group relative">
      <div className={`w-full h-full border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${selectedFile ? 'bg-teal-50 border-teal-400' : 'bg-white border-stone-200 group-hover:border-teal-400'}`}>
        <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
        {selectedFile ? (
          <div className="text-center px-4">
            <div className="text-sm font-bold text-stone-800 truncate max-w-[200px] mb-1">{selectedFile.name}</div>
            <div className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Document Secured</div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-xs font-black text-stone-400 uppercase tracking-widest">Drop PDF Resume</div>
            <div className="text-[10px] text-stone-300 mt-2">Maximum file size 5MB</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
