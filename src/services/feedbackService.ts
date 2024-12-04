// src/services/feedbackService.ts
import { API_BASE_URL } from '../config'
import { Feedback as FeedbackResponse } from '../types'

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
  private readonly baseUrl: string

  constructor() {
    this.baseUrl = API_BASE_URL
  }

  async getStats(searchTerm: string, dataset: string): Promise<FeedbackStats> {
    return this.fetch<FeedbackStats>(
      `api/feedback/stats?search=${encodeURIComponent(searchTerm)}&dataset=${encodeURIComponent(dataset)}`
    )
  }

  async getFeedbacks(searchTerm: string, dataset: string): Promise<FeedbackResponse[]> {
    return this.fetch<FeedbackResponse[]>(
      `api/feedback/list?search=${encodeURIComponent(searchTerm)}&dataset=${encodeURIComponent(dataset)}`
    )
  }

  async submitFeedback(data: FeedbackSubmission): Promise<FeedbackResponse> {
    return this.fetch<FeedbackResponse>('api/feedback/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async voteFeedback(feedbackId: number, isUpvote: boolean): Promise<void> {
    return this.fetch('api/feedback/vote', {
      method: 'POST',
      body: JSON.stringify({
        feedbackId,
        isUpvote
      })
    })
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
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Request failed')
    }

    return response.json()
  }
}

export const feedbackService = new FeedbackService()