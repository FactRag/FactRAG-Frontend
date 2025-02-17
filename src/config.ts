// src/config.ts
import { FeedbackType } from './types'

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://factcheck.dei.unipd.it'

export const AUTH_PROVIDERS = {
  GOOGLE: 'google',
  ORCID: 'orcid'
} as const

export const FEEDBACK_TYPES: Record<string, FeedbackType> = {
  Agree: 'agree',
  Uncertain: 'uncertain',
  Disagree: 'disagree'
} as const

export const EMOJIS: Record<FeedbackType, string> = {
  agree: '👍',
  disagree: '👎',
  uncertain: '😐'
} as const