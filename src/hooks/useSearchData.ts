import { useMemo } from 'react'
import type { SearchMatch, Triple } from '../types/search'
import { yagoData } from '../data/yago'

const realData: Record<string, Record<string, Triple>> = {
  'yago': yagoData
}

export const useSearchData = (searchTerm: string) => {
  return useMemo(() => {
    const results: SearchMatch[] = []
    const normalizedSearchTerm = searchTerm.toLowerCase().trim()

    if (!normalizedSearchTerm || normalizedSearchTerm.length < 3) {
      return results
    }

    Object.entries(realData).forEach(([dataset, identifiers]) => {
      Object.entries(identifiers).forEach(([identifier, triple]) => {
        const tripleString = `${triple.subject} ${triple.predicate} ${triple.object}`.toLowerCase()
        if (tripleString.includes(normalizedSearchTerm)) {
          results.push({
            text: `${triple.subject} ${triple.predicate} ${triple.object}`,
            dataset,
            identifier,
            triple
          })
        }
      })
    })

    return results
  }, [searchTerm])
}