import React, { useEffect, useState, useRef } from 'react';
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
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const binaryString = window.atob(originalFile.base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setOriginalUrl(url);

      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    } catch (e) {
      console.error("Error creating PDF preview URL", e);
    }
  }, [originalFile]);

  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow pop-ups to export the PDF.");
      return;
    }

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Optimized Resume</title>
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; background: white; }
            .print-wrapper {
              width: 210mm;
              margin: 0 auto;
              padding: 20mm;
              box-sizing: border-box;
            }
            ${resumeBaseStyles}
          </style>
        </head>
        <body>
          <div class="print-wrapper">
            <div class="prose-resume">
              ${improvedHtml}
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                // window.close(); // Optional: close window after print
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(fullHtml);
    printWindow.document.close();
  };

  const handleDownloadWord = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
          "xmlns:w='urn:schemas-microsoft-com:office:word' " +
          "xmlns='http://www.w3.org/TR/REC-html40'>" +
          "<head><meta charset='utf-8'><title>Resume Export</title><style>" + resumeBaseStyles + "</style></head><body>" +
          "<div class='prose-resume'>";
    const footer = "</div></body></html>";
    const sourceHTML = header + improvedHtml + footer;
    
    const blob = new Blob([sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = 'Optimized_Resume.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resumeBaseStyles = `
    .prose-resume {
      font-family: 'Arial', sans-serif;
      color: #1c1917;
      line-height: 1.5;
      font-size: 10.5pt;
    }
    .prose-resume h1 { font-size: 24pt; margin-bottom: 5pt; font-weight: bold; color: #000; text-align: center; }
    .prose-resume h2 { 
      font-size: 13pt; 
      border-bottom: 1.5pt solid #444; 
      margin-top: 15pt; 
      margin-bottom: 8pt; 
      font-weight: bold; 
      text-transform: uppercase; 
      color: #222; 
    }
    .prose-resume h3 { font-size: 11pt; margin-top: 10pt; font-weight: bold; margin-bottom: 2pt; color: #111; }
    .prose-resume p { margin-bottom: 6pt; }
    .prose-resume ul { padding-left: 18pt; margin-bottom: 10pt; list-style-type: disc; }
    .prose-resume li { margin-bottom: 3pt; }
    .prose-resume .contact-line { text-align: center; font-size: 9.5pt; margin-bottom: 15pt; color: #555; }
    @media print {
      body { -webkit-print-color-adjust: exact; }
    }
  `;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full h-full md:h-[95vh] md:max-w-[98vw] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-b border-stone-200 bg-stone-50/50 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-teal-600 p-2 rounded-xl text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">Optimization Result</h2>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">Side-by-side comparison & export</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <button
              onClick={onCancel}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-200 font-bold text-sm transition-all whitespace-nowrap"
            >
              Back
            </button>
            <button
              onClick={handleDownloadWord}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-stone-200 bg-white text-stone-800 hover:border-teal-500 font-bold text-sm transition-all flex items-center justify-center whitespace-nowrap"
            >
              Word
            </button>
            <button
              onClick={handlePrintPDF}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-stone-200 bg-white text-stone-800 hover:border-teal-500 font-bold text-sm transition-all flex items-center justify-center whitespace-nowrap"
            >
              PDF
            </button>
            <button
              onClick={onAccept}
              className="flex-1 sm:flex-none px-6 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 font-bold text-sm transition-all shadow-lg shadow-teal-600/20 whitespace-nowrap"
            >
              Apply to Profile
            </button>
          </div>
        </div>

        {/* Workspace Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Panel: Original Reference */}
          <div className="flex-1 flex flex-col border-r border-stone-200 bg-stone-100/50">
            <div className="px-6 py-2 bg-stone-100/80 border-b border-stone-200 flex justify-between items-center">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Master Original</span>
              <span className="text-[10px] bg-stone-200 px-2 py-0.5 rounded-full text-stone-600">PDF View</span>
            </div>
            <div className="flex-1 p-4 lg:p-8 overflow-hidden">
              {originalUrl ? (
                <iframe
                  src={`${originalUrl}#toolbar=0&navpanes=0`}
                  className="w-full h-full rounded-2xl shadow-xl bg-white border border-stone-200"
                  title="Original Preview"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-stone-400">
                  Loading Master...
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Improved Result */}
          <div className="flex-1 flex flex-col bg-stone-200/30 overflow-hidden">
            <div className="px-6 py-2 bg-teal-50 border-b border-teal-100 flex justify-between items-center">
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Optimized AI Revision</span>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold">A4 PREVIEW</span>
              </div>
            </div>
            
            {/* Scrollable Container for the Resume Page */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 lg:p-12 flex justify-center bg-stone-300/40"
            >
              {/* Virtual A4 Sheet */}
              <div className="resume-paper-container">
                <div className="resume-paper bg-white shadow-2xl p-[15mm] md:p-[20mm] ring-1 ring-black/5">
                  <div 
                    className="prose-resume"
                    dangerouslySetInnerHTML={{ __html: improvedHtml }} 
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        ${resumeBaseStyles}
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Resume Paper Styling */
        .resume-paper-container {
          width: 100%;
          max-width: 210mm; /* A4 Width */
          margin: 0 auto;
          display: flex;
          justify-content: center;
        }

        .resume-paper {
          width: 210mm;
          min-height: 297mm;
          box-sizing: border-box;
          transform-origin: top center;
          transition: transform 0.2s ease-out;
          background: white;
          color: black;
        }

        /* Responsive Scaling for the Paper Preview */
        @media (max-width: 210mm) {
          .resume-paper {
            transform: scale(calc(100vw / 230mm));
          }
          .resume-paper-container {
            height: calc(297mm * (100vw / 230mm));
          }
        }
        
        @media (min-width: 211mm) and (max-width: 1024px) {
          /* Scale within the split column */
          .resume-paper {
            transform: scale(0.6);
          }
          .resume-paper-container {
            height: calc(297mm * 0.6);
          }
        }

        @media (min-width: 1025px) and (max-width: 1440px) {
          .resume-paper {
            transform: scale(0.75);
          }
          .resume-paper-container {
            height: calc(297mm * 0.75);
          }
        }

        @media (min-width: 1441px) {
          .resume-paper {
            transform: scale(0.85);
          }
          .resume-paper-container {
            height: calc(297mm * 0.85);
          }
        }

        /* Ensure the prose content doesn't break out of the paper */
        .prose-resume * {
          max-width: 100%;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default ImprovementPreview;