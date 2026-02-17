
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
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (originalFile.mimeType === 'application/pdf') {
      const binaryString = window.atob(originalFile.base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setOriginalUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [originalFile]);

  // Robust scaling engine to ensure no content is cut off
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      const a4WidthPx = 794; // 210mm at 96dpi
      const a4HeightPx = 1123; // 297mm at 96dpi
      
      // Calculate scale to fit both width and height with padding
      const scaleX = (containerWidth - 60) / a4WidthPx;
      const scaleY = (containerHeight - 60) / a4HeightPx;
      
      setScale(Math.min(scaleX, scaleY, 1));
    };

    handleResize();
    const obs = new ResizeObserver(handleResize);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><style>${resumeBaseStyles}</style></head><body><div class="prose-resume">${improvedHtml}</div><script>window.onload=()=>window.print()</script></body></html>`);
    win.document.close();
  };

  const resumeBaseStyles = `
    .prose-resume { font-family: Arial, sans-serif; line-height: 1.4; color: #111; padding: 20mm; }
    .prose-resume h1 { font-size: 22pt; margin-bottom: 5pt; text-align: center; }
    .prose-resume h2 { font-size: 14pt; border-bottom: 2px solid #333; margin-top: 15pt; text-transform: uppercase; }
    .prose-resume p, .prose-resume li { font-size: 10pt; margin-bottom: 3pt; }
  `;

  return (
    <div className="fixed inset-0 z-[60] bg-stone-900/95 flex flex-col p-4 md:p-8">
      <div className="bg-white w-full h-full flex flex-col rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Toolbar */}
        <div className="flex items-center justify-between px-8 py-4 bg-stone-50 border-b border-stone-200">
          <h2 className="font-bold text-stone-900">Review Optimization</h2>
          <div className="flex gap-3">
            <button onClick={onCancel} className="px-5 py-2 rounded-xl text-stone-500 hover:bg-stone-200 font-bold transition-all">Discard</button>
            <button onClick={handlePrint} className="px-5 py-2 rounded-xl border border-stone-200 hover:border-teal-600 font-bold transition-all">Export PDF</button>
            <button onClick={onAccept} className="px-8 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-all shadow-lg">Apply Optimized Resume</button>
          </div>
        </div>

        {/* Viewport Split */}
        <div className="flex-1 flex flex-col lg:flex-row bg-stone-100 overflow-hidden">
          <div className="flex-1 flex flex-col border-r border-stone-200">
            <div className="px-4 py-1.5 bg-stone-100 text-[10px] font-black uppercase text-stone-400">Original Reference</div>
            <div className="flex-1 p-6">
              <iframe src={originalUrl || ''} className="w-full h-full bg-white rounded-xl shadow-md" title="Ref" />
            </div>
          </div>

          <div className="flex-1 flex flex-col" ref={containerRef}>
            <div className="px-4 py-1.5 bg-teal-50 text-[10px] font-black uppercase text-teal-600">AI Re-engineered Revision</div>
            <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
              <div 
                style={{ 
                  transform: `scale(${scale})`, 
                  width: '794px', 
                  height: '1123px',
                  backgroundColor: 'white',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                  flexShrink: 0
                }}
              >
                <div 
                  className="prose-resume" 
                  style={{ height: '100%', overflow: 'hidden' }}
                  dangerouslySetInnerHTML={{ __html: improvedHtml }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovementPreview;
