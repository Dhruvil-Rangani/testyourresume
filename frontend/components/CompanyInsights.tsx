
import React from 'react';
import { CompanyResearch } from '../types';

interface CompanyInsightsProps {
  research: CompanyResearch;
}

const CompanyInsights: React.FC<CompanyInsightsProps> = ({ research }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-black text-teal-600 uppercase tracking-widest">Live Company Research</h4>
        <span className="px-2 py-0.5 bg-teal-50 text-[10px] font-bold text-teal-600 rounded border border-teal-100 uppercase">Powered by Google Search</span>
      </div>
      
      <div className="space-y-4">
        <div>
          <h5 className="text-lg font-bold text-stone-900">{research.companyName}</h5>
          <p className="text-sm text-stone-600 mt-1 leading-relaxed italic">"{research.recentNews}"</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Strategic Talking Points</p>
            <ul className="space-y-1">
              {research.interviewTips.slice(0, 3).map((tip, i) => (
                <li key={i} className="text-xs text-stone-700 flex gap-2">
                  <span className="text-teal-500">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Verified Sources</p>
            <div className="flex flex-col gap-1">
              {research.sources.slice(0, 3).map((source, i) => (
                <a 
                  key={i} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-teal-600 hover:underline truncate max-w-xs"
                >
                  {source.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInsights;
