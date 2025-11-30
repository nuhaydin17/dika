import React, { useRef, useState } from 'react';
import { Upload, FileText, AlertCircle, FileUp } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    setError(null);
    if (file.type !== 'application/pdf') {
      setError('Lütfen geçerli bir PDF dosyası yükleyin.');
      return;
    }
    // Limit file size to roughly 20MB
    if (file.size > 20 * 1024 * 1024) {
      setError('Dosya boyutu çok yüksek. Lütfen 20MB altı bir dosya yükleyin.');
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`
          relative border-3 border-dashed rounded-[2rem] p-12 transition-all duration-300 cursor-pointer
          flex flex-col items-center justify-center text-center group overflow-hidden
          ${isDragging 
            ? 'border-orange-500 bg-orange-50/50 scale-[1.02] shadow-xl shadow-orange-100' 
            : 'border-orange-200 bg-white hover:border-orange-400 hover:bg-orange-50/30 hover:shadow-lg hover:shadow-orange-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".pdf"
          className="hidden"
          disabled={disabled}
        />
        
        {/* Decorative background circle */}
        <div className={`absolute w-64 h-64 bg-orange-100/50 rounded-full blur-3xl -z-10 transition-all duration-500 ${isDragging ? 'scale-150 opacity-70' : 'scale-100 opacity-0 group-hover:opacity-100'}`}></div>

        <div className={`p-6 rounded-2xl mb-6 transition-all duration-300 transform group-hover:-translate-y-2 ${isDragging ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg shadow-orange-200' : 'bg-orange-50 text-orange-500 group-hover:bg-gradient-to-br group-hover:from-orange-400 group-hover:to-amber-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-200'}`}>
          {isDragging ? <FileUp size={48} /> : <Upload size={48} />}
        </div>

        <h3 className="text-2xl font-bold text-stone-800 mb-3 tracking-tight">
          PDF Dosyasını Yükleyin
        </h3>
        <p className="text-stone-500 mb-8 max-w-xs mx-auto leading-relaxed">
          Analiz etmek istediğiniz kitabı buraya sürükleyin veya <span className="text-orange-600 font-bold underline decoration-2 decoration-orange-200 underline-offset-2 hover:decoration-orange-400 transition-all">bilgisayarınızdan seçin</span>
        </p>
        
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-stone-400 bg-stone-50 px-4 py-2 rounded-full border border-stone-100">
          <FileText size={14} />
          <span>Max 20MB PDF</span>
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-start p-4 text-sm text-red-700 rounded-2xl bg-red-50 border border-red-100 animate-shake" role="alert">
          <AlertCircle className="flex-shrink-0 inline w-5 h-5 mr-3 mt-0.5" />
          <span className="font-medium leading-relaxed">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;