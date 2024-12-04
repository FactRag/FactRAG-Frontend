// src/types/index.ts
export interface Triple {
  subject: string;
  predicate: string;
  object: string;
}

export interface Question {
  question: string;
  score: number;
}

export interface Analysis {
  error_category: string;
  error_detail: string;
  category: string;
  stratum: string;
  topic: string;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
}


export interface LoadingState {
  tripleProcessing: boolean;
  humanReadable: boolean;
  questions: boolean;
  googlePages: boolean;
  selectedDocs: boolean;
  llmSubmission: boolean;
  tieBreaker: boolean;
  finalDecision: boolean;
}

export type FeedbackType = 'agree' | 'disagree' | 'uncertain';

export interface FeedbackUser {
  id: number;
  username: string;
  email: string;
  avatar: string;
}

export interface Feedback {
  id: number;
  user: FeedbackUser;
  feedback: FeedbackType;
  comment: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  isPublic: boolean;
  hasUserVoted?: {
    upvoted: boolean;
    downvoted: boolean;
  };
}

export interface FeedbackStats {
  agree: number;
  disagree: number;
  uncertain: number;
  total: number;
}
