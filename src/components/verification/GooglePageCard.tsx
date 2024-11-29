import { GooglePage } from '../../types/verification'
import { HiExternalLink } from 'react-icons/hi'

export const GooglePageCard: React.FC<{
  page: GooglePage;
  index: number;
  onView: () => void;
}> = ({ page, index, onView }) => (
  <div className='bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow flex flex-col'>
    <div className='flex items-start justify-between mb-3'>
      <span className='inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800'>
        Source {index + 1}
      </span>
      <a
        href={page.url}
        target='_blank'
        rel='noopener noreferrer'
        className='text-blue-600 hover:text-blue-800'
      >
        <HiExternalLink className='w-4 h-4' />
      </a>
    </div>

    <p className='text-sm text-gray-600 mb-3 line-clamp-2 flex-grow'>
      {new URL(page.url).hostname}
    </p>

    <button
      onClick={onView}
      className='w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors'
    >
      View Content
    </button>
  </div>
)