import React from 'react';
import { ShieldCheck, ShieldAlert, RefreshCcw, BookOpenCheck, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ReportViewProps {
  report: string;
  fileName: string;
  onReset: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ report, fileName, onReset }) => {
  // Simple heuristic to detect positive/negative outcome for header styling
  const isRisky = report.toLowerCase().includes("uygun değildir") || report.toLowerCase().includes("tavsiye edilmez") || report.toLowerCase().includes("sakıncalı");

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      <div className="bg-white rounded-[2rem] shadow-xl shadow-stone-200/60 overflow-hidden border border-stone-100">
        {/* Header */}
        <div className={`relative px-8 py-10 md:px-12 ${isRisky ? 'bg-gradient-to-br from-red-50 to-orange-50' : 'bg-gradient-to-br from-emerald-50 to-teal-50'}`}>
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <FileText size={200} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 mb-4 shadow-sm">
                <BookOpenCheck size={14} className="text-stone-500" />
                <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                  Analiz Raporu
                </span>
              </div>
              
              <h2 className={`text-3xl md:text-4xl font-extrabold mb-2 ${isRisky ? 'text-red-900' : 'text-emerald-900'} leading-tight`}>
                Çocuk Güvenliği <br/>Değerlendirmesi
              </h2>
              
              <div className="flex items-center gap-2 mt-4 text-stone-600 bg-white/40 w-fit px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <span className="text-sm font-medium opacity-70">Dosya:</span>
                <span className="text-sm font-bold truncate max-w-[250px]">{fileName}</span>
              </div>
            </div>

            <div className={`flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-3xl shadow-lg transform rotate-3 transition-transform hover:rotate-0 ${isRisky ? 'bg-white text-red-500 shadow-red-100' : 'bg-white text-emerald-500 shadow-emerald-100'}`}>
              {isRisky ? <ShieldAlert size={48} strokeWidth={1.5} /> : <ShieldCheck size={48} strokeWidth={1.5} />}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          <div className="prose prose-lg prose-stone max-w-none 
            prose-headings:font-bold prose-headings:text-stone-800 
            prose-p:text-stone-600 prose-p:leading-relaxed 
            prose-li:text-stone-600
            prose-strong:text-orange-700 prose-strong:font-bold">
             <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-stone-900 mb-8 pb-4 border-b-2 border-orange-100" {...props} />,
                h2: ({node, ...props}) => {
                  const text = String(props.children);
                  const isConclusion = text.toLowerCase().includes('genel değerlendirme') || text.toLowerCase().includes('tavsiye');
                  return (
                    <div className={`mt-10 mb-6 flex items-start gap-4 ${isConclusion ? 'bg-orange-50 p-6 rounded-2xl border border-orange-100' : ''}`}>
                      {!isConclusion && <div className="mt-1.5 h-6 w-1.5 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full flex-shrink-0"></div>}
                      <h2 className={`text-xl font-bold m-0 ${isConclusion ? 'text-orange-900 text-2xl w-full' : 'text-stone-800'}`} {...props} />
                    </div>
                  );
                },
                h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-stone-700 mt-6 mb-3 flex items-center gap-2" {...props} />,
                ul: ({node, ...props}) => <ul className="space-y-3 mb-6 list-none pl-2" {...props} />,
                li: ({node, ...props}) => (
                  <li className="relative pl-8 text-stone-600">
                    <span className="absolute left-0 top-2.5 w-2 h-2 rounded-full bg-orange-300"></span>
                    <span className="block" {...props} />
                  </li>
                ),
                p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-stone-600" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-stone-800 bg-orange-50/80 px-1 rounded mx-0.5 box-decoration-clone" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-orange-200 pl-4 italic bg-stone-50 py-2 pr-2 rounded-r-lg my-4 text-stone-600" {...props} />
              }}
             >
                {report}
             </ReactMarkdown>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-stone-50 p-8 border-t border-stone-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-stone-400 font-medium max-w-md text-center md:text-left">
              * Bu rapor yapay zeka tarafından oluşturulmuştur. Kesin bir ebeveyn veya uzman denetiminin yerini tutmaz.
            </p>
            <button
              onClick={onReset}
              className="w-full md:w-auto px-8 py-3.5 bg-stone-900 hover:bg-black text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-stone-200 hover:shadow-stone-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
            >
              <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              Yeni Analiz Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;