import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from 'flowbite-react'
import { SearchHistoryItem } from '../../types/history'
import { HistoryService } from '../../services/HistoryService'

interface HistoryItemProps {
  item: SearchHistoryItem;
  datasetColor: string;
}

export const HistoryItem = memo(({ item, datasetColor }: HistoryItemProps) => (
  <Link
    to={`/results?search=${encodeURIComponent(item.searchTerm)}&dataset=${encodeURIComponent(item.dataset)}`}
    className='block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200'
    data-testid='history-item'
  >
    <div className='p-4'>
      <div className='text-sm font-medium text-gray-900 line-clamp-2 mb-2'>
        {item.humanReadable || item.searchTerm}
      </div>
      <div className='flex items-center text-xs text-gray-500'>
        <Badge color={datasetColor}>
          {item.dataset.charAt(0).toUpperCase() + item.dataset.slice(1)}
        </Badge>
        <span className='mx-2'>•</span>
        <span>{HistoryService.formatDate(item.timestamp)}</span>
      </div>
    </div>
  </Link>
))

HistoryItem.displayName = 'HistoryItem'