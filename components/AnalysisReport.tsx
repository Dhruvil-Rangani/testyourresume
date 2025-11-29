import React from 'react';
import { AtsAnalysisResult } from '../types';

interface AnalysisReportProps {
  result: AtsAnalysisResult;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ result }) => {
  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Missing Keywords Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <span className="bg-red-100 text-red-600 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </span>
          Missing Keywords
        </h3>
        <div className="flex flex-wrap gap-2">
          {result.missingKeywords.length > 0 ? (
            result.missingKeywords.map((keyword, idx) => (
              <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100">
                {keyword}
              </span>
            ))
          ) : (
            <p className="text-green-600 text-sm">Great job! No major keywords missing.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <span className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
            Strengths
          </h3>
          <ul className="space-y-2">
            {result.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start text-sm text-slate-600">
                <span className="mr-2 text-green-500 mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <span className="bg-orange-100 text-orange-600 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </span>
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {result.weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start text-sm text-slate-600">
                <span className="mr-2 text-orange-500 mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Improvement Plan */}
      <div className="bg-indigo-50 rounded-xl p-6 shadow-sm border border-indigo-100">
        <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
           <span className="bg-indigo-200 text-indigo-700 p-2 rounded-lg mr-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
             </svg>
           </span>
           Action Plan
        </h3>
        <ul className="space-y-3">
          {result.improvementPlan.map((step, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              <span className="text-sm text-indigo-800">{step}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Formatting Checks */}
       <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Formatting & Structure</h3>
        {result.formattingIssues.length === 0 ? (
          <div className="flex items-center text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Format looks clean and ATS-friendly!</span>
          </div>
        ) : (
          <ul className="space-y-2">
             {result.formattingIssues.map((issue, idx) => (
              <li key={idx} className="flex items-start text-sm text-slate-600">
                <span className="mr-2 text-red-500 mt-1">⚠</span>
                {issue}
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default AnalysisReport;
