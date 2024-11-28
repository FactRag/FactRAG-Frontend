// src/types/index.ts
export interface Triple {
    subject: string;
    predicate: string;
    object: string;
}

export interface ModelResponse {
    short_ans: string;
    full_ans: string;
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

// export interface VerificationData {
//     subject: string;
//     predicate: string;
//     object: string;
//     human_readable: string;
//     questions: Question[];
//     google_pages: Array<{
//         url: string;
//         html: string;
//     }>;
//     selected_docs: Array<{
//         file_id: string;
//     }>;
//     responses: Record<string, ModelResponse>;
//     need_tiebreaker: string;
//     tiebreakers_responses: Record<string, ModelResponse>;
//     final_decision: string;
//     actual_decision: string;
//     analysis: Analysis;
// }

export interface User {
    id: number;
    name: string;
    avatar: string;
}

export interface FeedbackResponse {
    id: number;
    user: User;
    feedback: 'agree' | 'disagree' | 'uncertain';
    comment: string;
    timestamp: string;
}

export interface FeedbackStats {
    agree: number;
    disagree: number;
    uncertain: number;
    total: number;
}

export interface VerificationStep {
    loading: string;
    content: string;
    action: () => Promise<void>;
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

export interface VerificationData {
    subject: string;
    predicate: string;
    object: string;
    human_readable: string;
    questions: Array<{
        question: string;
        score: string;
    }>;
    google_pages: Array<{
        url: string;
        html: string;
    }>;
    selected_docs: Array<{
        file_id: string;
    }>;
    final_question: string;
    responses: {
        [key: string]: {
            short_ans: string;
            full_ans: string;
        };
    };
    need_tiebreaker: string;
    tiebreakers_responses: {
        [key: string]: {
            short_ans: string;
            full_ans: string;
        };
    };
    final_decision: string;
    actual_decision: string;
    analysis: {
        error_category: string;
        error_detail: string;
        category: string;
        stratum: string;
        topic: string;
    };
}