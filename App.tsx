import React, { useState } from 'react';
import { AnalysisStatus, AtsAnalysisResult, FileData } from './types';
import { analyzeResume, improveResume } from './services/geminiService';
import FileUpload from './components/FileUpload';
import ScoreGauge from './components/ScoreGauge';
import AnalysisReport from './components/AnalysisReport';
import ImprovementPreview from './components/ImprovementPreview';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import PricingModal from './components/PricingModal';

const AppContent: React.FC = () => {
  const { user, incrementUsage, isLoading } = useAuth();
  
  const [resumeFile, setResumeFile] = useState<FileData | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AtsAnalysisResult | null>(null);
  const [showFullReport, setShowFullReport] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Improvement flow states
  const [isImproving, setIsImproving] = useState<boolean>(false);
  const [improvedResumeHtml, setImprovedResumeHtml] = useState<string | null>(null);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const handleAnalyze = async (overrideFile?: FileData) => {
    // 1. Check Limits
    if (user && user.plan === 'free' && user.creditsUsed >= user.maxCredits) {
      setShowPricingModal(true);
      return;
    }

    const fileToAnalyze = overrideFile || resumeFile;
    if (!fileToAnalyze) return;
    if (!jobDescription.trim()) return;

    setStatus(AnalysisStatus.ANALYZING);
    setErrorMsg(null);
    setShowFullReport(false);

    try {
      const data = await analyzeResume(fileToAnalyze.base64, fileToAnalyze.mimeType, jobDescription);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETE);
      
      // 2. Increment Usage on Success
      incrementUsage();

    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to analyze resume. Please ensure the API key is valid and try again.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleImproveResume = async () => {
    if (user && user.plan === 'free' && user.creditsUsed >= user.maxCredits) {
      setShowPricingModal(true);
      return;
    }

    if (!resumeFile || !result) return;
    
    setIsImproving(true);
    try {
      const optimizedHtml = await improveResume(
        resumeFile.base64, 
        resumeFile.mimeType, 
        jobDescription, 
        result
      );
      setImprovedResumeHtml(optimizedHtml);
    } catch (err) {
      console.error("Improvement failed", err);
      setErrorMsg("Failed to improve resume. Please try again.");
    } finally {
      setIsImproving(false);
    }
  };

  const handleAcceptImprovement = () => {
    if (!improvedResumeHtml) return;

    const base64Html = btoa(unescape(encodeURIComponent(improvedResumeHtml)));
    
    const newFile: FileData = {
      base64: base64Html,
      mimeType: 'text/html',
      name: 'Optimized_Resume.html'
    };

    setResumeFile(newFile);
    setImprovedResumeHtml(null); 
    handleAnalyze(newFile); 
  };

  const resetAnalysis = () => {
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setShowFullReport(false);
    setImprovedResumeHtml(null);
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center text-stone-500">Loading...</div>;

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      
      <Navbar 
        onOpenAuth={() => setShowAuthModal(true)} 
        onOpenPricing={() => setShowPricingModal(true)} 
      />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />

      {/* Modal for Preview */}
      {improvedResumeHtml && resumeFile && (
        <ImprovementPreview 
          originalFile={resumeFile}
          improvedHtml={improvedResumeHtml}
          onAccept={handleAcceptImprovement}
          onCancel={() => setImprovedResumeHtml(null)}
        />
      )}

      <div className="space-y-12">
        
        {/* Modern Hero Section */}
        <div className="text-center space-y-6 max-w-4xl mx-auto mt-8">
           <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-teal-600 mr-2"></span>
            AI-Powered Career Assistant
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900 leading-tight">
            Beat the ATS. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
              Land the Interview.
            </span>
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Upload your resume and the job description. Our Gemini-powered AI will score your match, highlight missing keywords, and automatically rewrite your resume to perfection.
          </p>
        </div>

        {/* Glass Card Input Section */}
        <div className="glass-panel rounded-3xl shadow-2xl shadow-stone-200 overflow-hidden relative border border-white">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500"></div>
          <div className="p-6 md:p-10 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Col: Upload */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-white shadow-md text-teal-600 flex items-center justify-center font-bold text-lg border border-teal-50">1</div>
                  <h2 className="text-xl font-bold text-stone-800">Upload Resume</h2>
                </div>
                <FileUpload 
                  onFileSelect={setResumeFile} 
                  selectedFile={resumeFile} 
                />
              </div>

              {/* Right Col: Job Description */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-2">
                   <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-white shadow-md text-teal-600 flex items-center justify-center font-bold text-lg border border-teal-50">2</div>
                   <h2 className="text-xl font-bold text-stone-800">Job Description</h2>
                </div>
                <div className="relative">
                  <textarea
                    className="w-full h-44 p-4 rounded-xl border border-stone-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-sm resize-none shadow-inner"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6 flex justify-center">
              <button
                onClick={() => handleAnalyze()}
                disabled={!resumeFile || !jobDescription || status === AnalysisStatus.ANALYZING}
                className={`
                  relative px-10 py-4 rounded-2xl font-bold text-lg text-white shadow-xl shadow-teal-500/20 transform transition-all duration-200
                  ${!resumeFile || !jobDescription || status === AnalysisStatus.ANALYZING
                    ? 'bg-stone-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:scale-105 hover:-translate-y-1'
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
              <div className="bg-rose-50 text-rose-700 p-4 rounded-xl text-sm text-center border border-rose-100 shadow-sm">
                {errorMsg}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {status === AnalysisStatus.COMPLETE && result && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-16">
             
             {/* Score Card */}
             <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-white overflow-hidden">
               <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
                 
                 <div className="flex-shrink-0 relative">
                   <div className="absolute inset-0 bg-teal-500 blur-3xl opacity-10 rounded-full"></div>
                   <ScoreGauge score={result.score} />
                 </div>

                 <div className="flex-1 text-center md:text-left space-y-6">
                    <div>
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <h3 className="text-3xl font-bold text-stone-900">Match Analysis</h3>
                        {resumeFile?.mimeType === 'text/html' && (
                           <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider border border-emerald-200">
                             Optimized
                           </span>
                        )}
                      </div>
                      <p className="text-stone-500 text-base mt-2">Based on keyword frequency, semantic relevance, and ATS formatting standards.</p>
                    </div>
                    <p className="text-stone-700 leading-relaxed text-lg bg-stone-50 p-6 rounded-xl border border-stone-100">
                      {result.summary}
                    </p>
                    
                    {!showFullReport && (
                      <div className="pt-2">
                        <button 
                          onClick={() => setShowFullReport(true)}
                          className="inline-flex items-center px-8 py-3.5 border border-teal-200 shadow-sm text-sm font-bold rounded-xl text-teal-700 bg-teal-50 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                        >
                          View Full Report
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                 </div>
               </div>
               
               {/* Full Report Dropdown */}
               {showFullReport && (
                 <div className="border-t border-stone-100 bg-stone-50/50 p-6 md:p-12">
                   <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-bold text-stone-800">Detailed Report</h2>
                      <button 
                        onClick={() => setShowFullReport(false)}
                        className="text-sm font-medium text-stone-500 hover:text-teal-600 transition-colors"
                      >
                        Hide Report
                      </button>
                   </div>
                   <AnalysisReport 
                    result={result} 
                    onImprove={handleImproveResume}
                    isImproving={isImproving}
                   />
                 </div>
               )}
             </div>

             <div className="text-center">
               <button 
                onClick={resetAnalysis}
                className="text-stone-400 hover:text-teal-600 text-sm font-medium transition-colors flex items-center justify-center mx-auto"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                 </svg>
                 Start New Analysis
               </button>
             </div>

           </div>
        )}
      </div>
    </div>
  );
};

// Wrapper to provide Context
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;