import React, { memo } from 'react'
import type { SearchMatch } from '../../types/search'

interface SearchSuggestionProps {
  match: SearchMatch;
  onSelect: (match: SearchMatch) => void;
}

const SearchSuggestion: React.FC<SearchSuggestionProps> = memo(({ match, onSelect }) => (
  <button
    onClick={() => onSelect(match)}
    className='w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100'
  >
    <div className='flex justify-between items-center gap-2'>
      <span className='text-gray-900 truncate'>{match.text}</span>
      <div className='flex items-center gap-2 flex-shrink-0'>
        <span className='bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-400'>
          {match.dataset}
        </span>
        <span className='text-xs text-gray-400 min-w-[5ch] text-right whitespace-pre'>
          {match.identifier.length > 5 ? match.identifier.slice(0, 5) : match.identifier.padEnd(5, '')}
        </span>
      </div>
    </div>
  </button>
))

SearchSuggestion.displayName = 'SearchSuggestion'

export default SearchSuggestion