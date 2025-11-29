import React, { useState } from 'react';
import { AnalysisStatus, AtsAnalysisResult, FileData } from './types';
import { analyzeResume } from './services/geminiService';
import FileUpload from './components/FileUpload';
import ScoreGauge from './components/ScoreGauge';
import AnalysisReport from './components/AnalysisReport';

const App: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<FileData | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AtsAnalysisResult | null>(null);
  const [showFullReport, setShowFullReport] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeFile) return;
    if (!jobDescription.trim()) return;

    setStatus(AnalysisStatus.ANALYZING);
    setErrorMsg(null);
    setShowFullReport(false);

    try {
      const data = await analyzeResume(resumeFile.base64, resumeFile.mimeType, jobDescription);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to analyze resume. Please ensure the API key is valid and try again.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const resetAnalysis = () => {
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setShowFullReport(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Resume <span className="text-indigo-600">ATS Score</span> Checker
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Optimize your resume with AI-powered insights. Upload your resume and the job description to get a compatibility score and actionable feedback.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="p-6 md:p-8 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Col: Upload */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">1</div>
                  <h2 className="text-xl font-semibold text-slate-800">Upload Resume</h2>
                </div>
                <FileUpload 
                  onFileSelect={setResumeFile} 
                  selectedFile={resumeFile} 
                />
              </div>

              {/* Right Col: Job Description */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                   <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">2</div>
                   <h2 className="text-xl font-semibold text-slate-800">Job Description</h2>
                </div>
                <textarea
                  className="w-full h-40 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-sm resize-none"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!resumeFile || !jobDescription || status === AnalysisStatus.ANALYZING}
                className={`
                  relative px-8 py-4 rounded-full font-bold text-white shadow-lg transform transition-all duration-200
                  ${!resumeFile || !jobDescription || status === AnalysisStatus.ANALYZING
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 hover:shadow-indigo-500/30'
                  }
                `}
              >
                {status === AnalysisStatus.ANALYZING ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "Calculate ATS Score"
                )}
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm text-center border border-red-100">
                {errorMsg}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {status === AnalysisStatus.COMPLETE && result && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
             
             {/* Score Card */}
             <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
               <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-10">
                 
                 <div className="flex-shrink-0">
                   <ScoreGauge score={result.score} />
                 </div>

                 <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Match Analysis</h3>
                      <p className="text-slate-500 text-sm mt-1">Based on keyword frequency, relevance, and format.</p>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-lg">
                      {result.summary}
                    </p>
                    
                    {!showFullReport && (
                      <div className="pt-4">
                        <button 
                          onClick={() => setShowFullReport(true)}
                          className="inline-flex items-center px-6 py-3 border border-indigo-200 shadow-sm text-sm font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          View Full Report
                        </button>
                      </div>
                    )}
                 </div>
               </div>
               
               {/* Full Report Dropdown */}
               {showFullReport && (
                 <div className="border-t border-slate-100 bg-slate-50/50 p-6 md:p-10">
                   <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-slate-800">Detailed Report</h2>
                      <button 
                        onClick={() => setShowFullReport(false)}
                        className="text-sm text-slate-500 hover:text-indigo-600 underline"
                      >
                        Hide Report
                      </button>
                   </div>
                   <AnalysisReport result={result} />
                 </div>
               )}
             </div>

             <div className="text-center">
               <button 
                onClick={resetAnalysis}
                className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
               >
                 Start New Analysis
               </button>
             </div>

           </div>
        )}

      </div>
    </div>
  );
};

export default App;
