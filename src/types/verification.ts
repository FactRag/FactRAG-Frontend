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
  need_tiebreaker: boolean;
  tiebreakers_responses: Record<string, ModelResponse>;
  final_decision: number;
  actual_decision: number;
  analysis: Analysis;
  errors: Record<string, ErrorAnalysis>;
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
  stratum: string;
  topic: string;
}

export interface ErrorAnalysis {
  category: number;
  reason: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description?: string;
  prompt?: string;
  examples?: { input: string; output: string }[];
}
