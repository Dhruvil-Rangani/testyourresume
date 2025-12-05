import React from 'react';
import { FileData } from '../types';

interface ImprovementPreviewProps {
  originalFile: FileData;
  improvedHtml: string;
  onAccept: () => void;
  onCancel: () => void;
}

const ImprovementPreview: React.FC<ImprovementPreviewProps> = ({ 
  originalFile, 
  improvedHtml, 
  onAccept, 
  onCancel 
}) => {
  
  const handleDownload = () => {
    const blob = new Blob([improvedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Optimized_Resume.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-50 w-full max-w-7xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-stone-200">
          <h2 className="text-xl font-bold text-stone-800 flex items-center">
            <span className="bg-teal-100 text-teal-600 p-1.5 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
              </svg>
            </span>
            Resume Optimization Preview
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-100 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-lg border border-teal-200 text-teal-700 hover:bg-teal-50 font-medium text-sm flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download HTML
            </button>
            <button
              onClick={onAccept}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Accept & Check Score
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left: Original (PDF) */}
          <div className="w-full md:w-1/2 flex flex-col border-r border-stone-200 bg-stone-100">
            <div className="p-3 bg-white border-b border-stone-200 text-center font-medium text-stone-500 text-sm">
              Original Resume
            </div>
            <div className="flex-1 p-4 overflow-hidden relative">
              {originalFile.mimeType === 'application/pdf' ? (
                <iframe 
                  src={`data:application/pdf;base64,${originalFile.base64}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full rounded-lg shadow-sm bg-white"
                  title="Original Resume"
                />
              ) : (
                <div className="w-full h-full rounded-lg shadow-sm bg-white flex items-center justify-center text-stone-400">
                  Preview not available for this file type
                </div>
              )}
            </div>
          </div>

          {/* Right: Improved (HTML) */}
          <div className="w-full md:w-1/2 flex flex-col bg-stone-50">
             <div className="p-3 bg-white border-b border-stone-200 text-center font-medium text-teal-600 text-sm">
              Improved Version
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div 
                className="bg-white p-8 rounded-lg shadow-sm min-h-full prose max-w-none"
                dangerouslySetInnerHTML={{ __html: improvedHtml }} 
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ImprovementPreview;