
import React, { useEffect, useState, useRef } from 'react';
import { FileData } from '../types';

interface ImprovementPreviewProps {
  originalFile: FileData;
  improvedHtml: string;
  onAccept: () => void;
  onCancel: () => void;
}

const ImprovementPreview: React.FC<ImprovementPreviewProps> = ({ originalFile, improvedHtml, onAccept, onCancel }) => {
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

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth;
      const ch = containerRef.current.clientHeight;
      setScale(Math.min((cw - 60) / 794, (ch - 60) / 1123, 1));
    };
    handleResize();
    const obs = new ResizeObserver(handleResize);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><style>${resumeStyles}</style></head><body><div class="prose-resume">${improvedHtml}</div><script>window.onload=()=>window.print()</script></body></html>`);
    win.document.close();
  };

  const resumeStyles = `.prose-resume { font-family: Arial; padding: 20mm; } .prose-resume h1 { text-align: center; } .prose-resume h2 { border-bottom: 2pt solid #333; margin-top: 15pt; }`;

  return (
    <div className="fixed inset-0 z-[60] bg-stone-900/95 flex flex-col p-6">
      <div className="bg-white w-full h-full flex flex-col rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-8 py-4 bg-stone-50 border-b border-stone-200">
          <h2 className="font-bold text-stone-900">Optimization Review</h2>
          <div className="flex gap-3">
            <button onClick={onCancel} className="px-5 py-2 text-stone-500 font-bold">Discard</button>
            <button onClick={handlePrint} className="px-5 py-2 border rounded-xl font-bold">Print PDF</button>
            <button onClick={onAccept} className="px-8 py-2 bg-teal-600 text-white font-bold rounded-xl">Apply Changes</button>
          </div>
        </div>
        <div className="flex-1 flex flex-col lg:flex-row bg-stone-100 overflow-hidden">
          <div className="flex-1 border-r border-stone-200 p-6"><iframe src={originalUrl || ''} className="w-full h-full bg-white rounded-xl" title="Ref" /></div>
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden" ref={containerRef}>
            <div style={{ transform: `scale(${scale})`, width: '794px', height: '1123px', backgroundColor: 'white' }}>
              <div className="prose-resume" style={{ height: '100%', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: improvedHtml }} />
            </div>
          </div>
        </div>
      </div>
      <style>{resumeStyles}</style>
    </div>
  );
};

export default ImprovementPreview;
