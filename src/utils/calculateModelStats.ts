import { ModelResponse } from '../types/verification'

export const calculateModelStats = (responses: Record<string, ModelResponse>) => {
  const counts = {
    verified: 0,
    notVerified: 0,
    noAnswer: 0
  }

  Object.values(responses).forEach(response => {
    const ans = response.short_ans
    if (ans === 1) counts.verified++
    else if (ans === 0) counts.notVerified++
    else counts.noAnswer++
  })

  const totalResponses = Object.keys(responses).length - counts.noAnswer

  return {
    ...counts,
    verifiedRate: totalResponses > 0 ? (counts.verified / totalResponses * 100) : 0,
    notVerifiedRate: totalResponses > 0 ? (counts.notVerified / totalResponses * 100) : 0
  }
}