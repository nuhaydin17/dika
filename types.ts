export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: string | null;
}

export interface FileData {
  name: string;
  content: string; // Extracted text content
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  FILE_READY = 'FILE_READY',
  READING_PDF = 'READING_PDF',
  ANALYZING_AI = 'ANALYZING_AI',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}