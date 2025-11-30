import React, { useState } from 'react';
import { BookOpen, Baby, BrainCircuit, Loader2, FileText, Play, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ReportView from './components/ReportView';
import { AnalysisStatus } from './types';
import { extractTextFromPdf } from './services/pdfService';
import { analyzeTextWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [report, setReport] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus(AnalysisStatus.FILE_READY);
    setErrorMessage(null);
  };

  const startAnalysis = async () => {
    if (!file) return;

    setStatus(AnalysisStatus.READING_PDF);
    setErrorMessage(null);

    try {
      // 1. Extract Text
      const text = await extractTextFromPdf(file);
      
      // Lowered limit to 10 characters to support picture books with less text
      if (!text || text.trim().length < 10) {
        throw new Error("PDF içeriği çok kısa veya okunamadı. Lütfen metin içeren bir PDF yükleyin (görsel ağırlıklı PDF'ler okunamayabilir).");
      }

      // 2. Analyze with Gemini
      setStatus(AnalysisStatus.ANALYZING_AI);
      const analysisResult = await analyzeTextWithGemini(text);
      
      setReport(analysisResult);
      setStatus(AnalysisStatus.COMPLETE);

    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Bir hata oluştu.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setReport(null);
    setFile(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-800 selection:bg-orange-100 selection:text-orange-900">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* Header/Nav */}
      <header className="relative z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-0">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={handleReset}>
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-2.5 rounded-2xl text-white shadow-lg shadow-orange-200">
              <Baby size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-900 leading-none tracking-tight">DİKA</h1>
              <p className="text-xs text-stone-500 font-bold tracking-wide uppercase">Dijital Kitap Asistanı</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-5 py-2 bg-orange-50 rounded-full border border-orange-100 shadow-sm">
              <ShieldCheck size={16} className="text-orange-600" />
              <span className="text-xs font-bold text-orange-800 tracking-wide">Güvenli Kitap, Mutlu Gelecek</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-16">
        {/* Progress Steps */}
        {status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETE && (
          <div className="max-w-xl mx-auto mb-12 flex justify-between items-center px-8 relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-stone-200 -z-10"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-stone-800 text-white`}>1</div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500 ${status === AnalysisStatus.FILE_READY ? 'bg-orange-500 text-white' : 'bg-stone-800 text-white'}`}>2</div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500 ${status === AnalysisStatus.ANALYZING_AI ? 'bg-orange-500 text-white' : (status === AnalysisStatus.READING_PDF ? 'bg-orange-200 text-white' : 'bg-stone-200 text-stone-400')}`}>3</div>
          </div>
        )}

        {/* Hero Section (Only visible when IDLE) */}
        {status === AnalysisStatus.IDLE && (
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-orange-100 shadow-sm text-stone-600 text-sm font-semibold mb-8 hover:scale-105 transition-transform duration-300">
              <BrainCircuit size={16} className="text-orange-500" />
              <span>Yapay Zeka Destekli İçerik Analizi</span>
            </div>
            
            <h2 className="flex flex-col items-center justify-center font-black mb-10 tracking-tight leading-tight">
              <span className="text-7xl md:text-8xl text-orange-500 mb-2 drop-shadow-sm tracking-tighter">DİKA</span>
              <span className="text-2xl md:text-3xl text-black font-bold tracking-normal">Dijital Kitap Asistanı</span>
            </h2>
            
            <p className="text-xl text-stone-600 leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
              Çocuğunuzun okuyacağı kitabı saniyeler içinde analiz edin. 
              <span className="text-stone-900 font-semibold"> Şiddet, dil ve tematik</span> unsurları yapay zeka ile tespit edip detaylı pedagojik rapor alın.
            </p>
          </div>
        )}

        {/* Content Area */}
        <div className="flex justify-center transition-all duration-500 ease-in-out">
          {status === AnalysisStatus.IDLE && (
            <div className="w-full">
               <FileUpload onFileSelect={handleFileSelect} disabled={false} />
            </div>
          )}

          {status === AnalysisStatus.FILE_READY && file && (
            <div className="w-full max-w-xl bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-orange-200/40 border border-white animate-fade-in">
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-orange-500 shadow-inner">
                  <FileText size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 break-all px-4 mb-2">{file.name}</h3>
                <p className="text-stone-500 font-medium inline-block bg-stone-100 px-3 py-1 rounded-lg">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={startAnalysis}
                  className="group w-full py-5 bg-stone-900 hover:bg-black text-white font-bold text-lg rounded-2xl shadow-xl shadow-stone-300 hover:shadow-stone-400 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
                >
                  <span className="relative flex items-center gap-2">
                    Analizi Başlat
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button 
                  onClick={handleReset}
                  className="w-full py-4 bg-white hover:bg-red-50 text-stone-500 hover:text-red-500 font-bold rounded-2xl border-2 border-transparent hover:border-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={20} />
                  Farklı Dosya Seç
                </button>
              </div>
            </div>
          )}

          {(status === AnalysisStatus.READING_PDF || status === AnalysisStatus.ANALYZING_AI) && (
            <div className="w-full max-w-xl bg-white rounded-[2.5rem] p-12 shadow-2xl shadow-orange-100/50 border border-white text-center">
               <div className="relative w-32 h-32 mx-auto mb-10">
                  <div className="absolute inset-0 border-8 border-stone-100 rounded-full"></div>
                  <div className="absolute inset-0 border-8 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-orange-600 bg-white rounded-full m-2 shadow-sm">
                    {status === AnalysisStatus.READING_PDF ? (
                        <BookOpen size={40} className="animate-pulse" />
                    ) : (
                        <BrainCircuit size={40} className="animate-pulse" />
                    )}
                  </div>
               </div>
               
               <h3 className="text-2xl font-bold text-stone-900 mb-3">
                 {status === AnalysisStatus.READING_PDF ? 'Kitap Okunuyor...' : 'Yapay Zeka İnceliyor...'}
               </h3>
               <p className="text-stone-500 text-lg max-w-xs mx-auto leading-relaxed">
                 {status === AnalysisStatus.READING_PDF 
                   ? 'Metin içerikleri ayıklanıyor, lütfen bekleyin.' 
                   : 'Pedagojik kriterlere göre içerik değerlendiriliyor.'}
               </p>
               
               {status === AnalysisStatus.ANALYZING_AI && (
                 <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    <span className="text-xs font-bold text-orange-700 ml-2">Rapor hazırlanıyor</span>
                 </div>
               )}
            </div>
          )}

          {status === AnalysisStatus.COMPLETE && report && (
            <ReportView report={report} fileName={file?.name || ''} onReset={handleReset} />
          )}

          {status === AnalysisStatus.ERROR && (
            <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-xl border-t-4 border-red-500 text-center animate-shake">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                <span className="text-4xl font-bold">!</span>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">Bir Sorun Oluştu</h3>
              <p className="text-stone-600 mb-8 leading-relaxed">{errorMessage}</p>
              <button 
                onClick={handleReset}
                className="w-full px-8 py-4 bg-stone-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg shadow-stone-200"
              >
                Tekrar Dene
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;