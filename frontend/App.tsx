
import React, { useState } from 'react';
import { AnalysisStatus, AtsAnalysisResult, FileData } from './types';
import { performAtsAnalysis, generateOptimizedResume } from '../backend/ai';
import { createCheckoutSession } from '../backend/stripe';
import FileUpload from './components/FileUpload';
import ScoreGauge from './components/ScoreGauge';
import AnalysisReport from './components/AnalysisReport';
import ImprovementPreview from './components/ImprovementPreview';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import PricingModal from './components/PricingModal';

const AppContent: React.FC = () => {
  const { user, incrementUsage, upgradePlan, isLoading } = useAuth();
  
  const [resumeFile, setResumeFile] = useState<FileData | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AtsAnalysisResult | null>(null);
  const [showFullReport, setShowFullReport] = useState<boolean>(false);
  
  const [isImproving, setIsImproving] = useState<boolean>(false);
  const [improvedResumeHtml, setImprovedResumeHtml] = useState<string | null>(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const handleAnalyze = async (overrideFile?: FileData) => {
    if (user && user.plan === 'free' && user.creditsUsed >= user.maxCredits) {
      setShowPricingModal(true);
      return;
    }

    const fileToAnalyze = overrideFile || resumeFile;
    if (!fileToAnalyze || !jobDescription.trim()) return;

    setStatus(AnalysisStatus.ANALYZING);
    setShowFullReport(false);

    try {
      const data = await performAtsAnalysis(fileToAnalyze.base64, fileToAnalyze.mimeType, jobDescription);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETE);
      await incrementUsage();
    } catch (err) {
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleImproveResume = async () => {
    if (!resumeFile || !result) return;
    setIsImproving(true);
    try {
      const optimizedHtml = await generateOptimizedResume(resumeFile.base64, resumeFile.mimeType, jobDescription, result);
      setImprovedResumeHtml(optimizedHtml);
    } catch (err) {
      console.error(err);
    } finally { setIsImproving(false); }
  };

  const handlePayment = async (plan: 'monthly' | 'annual') => {
    const success = await createCheckoutSession(plan);
    if (success) {
      await upgradePlan();
      setShowPricingModal(false);
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center font-bold text-stone-400">CONNECTING TO BACKEND...</div>;

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      <Navbar onOpenAuth={() => setShowAuthModal(true)} onOpenPricing={() => setShowPricingModal(true)} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} onSubscribe={handlePayment} />

      {improvedResumeHtml && resumeFile && (
        <ImprovementPreview 
          originalFile={resumeFile}
          improvedHtml={improvedResumeHtml}
          onAccept={() => {
            const base64Html = btoa(unescape(encodeURIComponent(improvedResumeHtml)));
            const newFile: FileData = { base64: base64Html, mimeType: 'text/html', name: 'Optimized_Resume.html' };
            setResumeFile(newFile);
            setImprovedResumeHtml(null);
            handleAnalyze(newFile);
          }}
          onCancel={() => setImprovedResumeHtml(null)}
        />
      )}

      <div className="space-y-12">
        <header className="text-center space-y-4 max-w-4xl mx-auto mt-8">
           <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800">
            Professional AI Backend v2.0
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900">
            ATS <span className="text-teal-600">Master</span>
          </h1>
          <p className="text-stone-500 text-lg">AI-Powered Resume Optimization Platform</p>
        </header>

        <main className="glass-panel rounded-3xl shadow-2xl border border-white p-6 md:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-stone-800">Resume Source</h2>
              <FileUpload onFileSelect={setResumeFile} selectedFile={resumeFile} />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-stone-800">Job Description</h2>
              <textarea
                className="w-full h-44 p-4 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-teal-500 transition-all text-sm resize-none"
                placeholder="Paste the target JD here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => handleAnalyze()}
              disabled={!resumeFile || !jobDescription || status === AnalysisStatus.ANALYZING}
              className={`px-12 py-4 rounded-2xl font-bold text-lg text-white shadow-xl transition-all 
                ${!resumeFile || !jobDescription || status === AnalysisStatus.ANALYZING ? 'bg-stone-300' : 'bg-stone-900 hover:bg-teal-600'}`}
            >
              {status === AnalysisStatus.ANALYZING ? "Analyzing..." : "Calculate Match"}
            </button>
          </div>
        </main>

        {status === AnalysisStatus.COMPLETE && result && (
           <div className="space-y-6 pb-16">
             <section className="bg-white rounded-3xl shadow-xl border border-stone-100 p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
               <ScoreGauge score={result.score} />
               <div className="flex-1 text-center md:text-left space-y-4">
                  <h3 className="text-3xl font-bold text-stone-900">ATS Insights</h3>
                  <p className="text-stone-700 leading-relaxed text-lg bg-stone-50 p-6 rounded-xl border border-stone-200">{result.summary}</p>
                  <button onClick={() => setShowFullReport(!showFullReport)} className="px-8 py-3 rounded-xl border border-teal-200 text-teal-700 font-bold bg-teal-50">
                    {showFullReport ? "Hide Detailed Report" : "View Full Report"}
                  </button>
               </div>
             </section>
             {showFullReport && <AnalysisReport result={result} onImprove={handleImproveResume} isImproving={isImproving} />}
           </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => <AuthProvider><AppContent /></AuthProvider>;
export default App;
