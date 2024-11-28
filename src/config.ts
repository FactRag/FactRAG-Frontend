// src/config.ts
import { FeedbackType } from './types';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const AUTH_PROVIDERS = {
    GOOGLE: 'google',
    ORCID: 'orcid'
} as const;

export const FEEDBACK_TYPES: Record<string, FeedbackType> = {
    LOVE: 'love',
    LIKE: 'like',
    NEUTRAL: 'neutral',
    DISLIKE: 'dislike'
} as const;

export const EMOJIS: Record<FeedbackType, string> = {
    love: '❤️',
    like: '👍',
    neutral: '😐',
    dislike: '👎'
} as const;