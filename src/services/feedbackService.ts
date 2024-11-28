// src/services/feedbackService.ts
import { API_BASE_URL } from '../config';
import {Feedback as FeedbackResponse} from "../types";

// export interface FeedbackResponse {
//     id: number;
//     user: {
//         name: string;
//         avatar: string;
//     };
//     feedback: 'love' | 'like' | 'neutral' | 'dislike';
//     comment: string;
//     timestamp: string;
//     upvotes: number;
//     downvotes: number;
//     isPublic: boolean;
//     hasUserVoted?: {
//         upvoted: boolean;
//         downvoted: boolean;
//     };
// }

export interface FeedbackStats {
    love: number;
    like: number;
    neutral: number;
    dislike: number;
    total: number;
}

export interface FeedbackSubmission {
    searchTerm: string;
    dataset: string;
    feedback: string;
    comment: string;
    isPublic: boolean;
}

class FeedbackService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    private async fetch<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Request failed');
        }

        return response.json();
    }

    async getStats(searchTerm: string, dataset: string): Promise<FeedbackStats> {
        return this.fetch<FeedbackStats>(
            `/feedback/stats?search=${encodeURIComponent(searchTerm)}&dataset=${encodeURIComponent(dataset)}`
        );
    }

    async getFeedbacks(searchTerm: string, dataset: string): Promise<FeedbackResponse[]> {
        return this.fetch<FeedbackResponse[]>(
            `/feedback/list?search=${encodeURIComponent(searchTerm)}&dataset=${encodeURIComponent(dataset)}`
        );
    }

    async submitFeedback(data: FeedbackSubmission): Promise<FeedbackResponse> {
        return this.fetch<FeedbackResponse>('/feedback/submit', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async voteFeedback(feedbackId: number, isUpvote: boolean): Promise<void> {
        return this.fetch('/feedback/vote', {
            method: 'POST',
            body: JSON.stringify({
                feedbackId,
                isUpvote
            })
        });
    }
}

export const feedbackService = new FeedbackService();