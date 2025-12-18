
import React from 'react';
import { AtsAnalysisResult } from '../types';

interface AnalysisReportProps {
  result: AtsAnalysisResult;
  onImprove: () => void;
  isImproving: boolean;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ result, onImprove, isImproving }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-4">Critical Missing Keywords</h4>
        <div className="flex flex-wrap gap-2">
          {result.missingKeywords.map((k, i) => (
            <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold border border-rose-100">{k}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <h4 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-4">Core Strengths</h4>
          <ul className="space-y-3">
            {result.strengths.map((s, i) => <li key={i} className="text-sm text-stone-600 flex gap-2">
              <span className="text-teal-500 font-bold">✓</span> {s}
            </li>)}
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
          <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-4">Identified Gaps</h4>
          <ul className="space-y-3">
            {result.weaknesses.map((w, i) => <li key={i} className="text-sm text-stone-600 flex gap-2">
              <span className="text-amber-500 font-bold">!</span> {w}
            </li>)}
          </ul>
        </div>
      </div>

      <div className="bg-teal-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2">
            <h4 className="text-xl font-bold">AI Optimization Ready</h4>
            <p className="text-teal-100 text-sm opacity-80">Our engine can automatically weave in missing keywords and impact-driven phrasing.</p>
          </div>
          <button 
            onClick={onImprove}
            disabled={isImproving}
            className="whitespace-nowrap px-8 py-4 bg-white text-teal-900 rounded-2xl font-black uppercase text-sm hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
          >
            {isImproving ? "Re-engineering Resume..." : "Auto-Optimize Now"}
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>
    </div>
  );
};

export default AnalysisReport;
