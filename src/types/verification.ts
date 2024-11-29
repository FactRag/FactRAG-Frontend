// types/verification.ts
export interface VerificationData {
  subject: string;
  predicate: string;
  object: string;
  human_readable: string;
  questions: Question[];
  google_pages: GooglePage[];
  selected_docs: SelectedDoc[];
  responses: Record<string, ModelResponse>;
  final_decision: string;
  analysis: Analysis;
}


export interface Question {
  question: string;
  score: number;
}

export interface GooglePage {
  url: string;
  html: string;
}

export interface SelectedDoc {
  file_id: string;
}

export interface ModelResponse {
  short_ans: number;
  full_ans: string;
}

export interface Analysis {
  error_category: string;
  error_detail: string;
  category: string;
  stratum: string;
  topic: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description?: string;
  prompt?: string;
  examples?: { input: string; output: string }[];
}
