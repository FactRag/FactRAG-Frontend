import { VerificationData } from '../../types/verification'
import { useState } from 'react'

export const PromptSection: React.FC<{
  title: string;
  content: string;
  data: VerificationData;
}> = ({ title, content, data }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className='mb-6'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='text-sm font-semibold text-gray-700'>{title}</h3>
        <button
          className='text-sm text-blue-600 hover:text-blue-800'
          onClick={() => setIsVisible(!isVisible)}
        >
          Show/Hide Details
        </button>
      </div>

      <div className={!isVisible ? 'hidden' : ''}>
        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto'>
          <pre className='text-xs text-gray-600 whitespace-pre-wrap'>{content}</pre>
        </div>
        {title.includes('Question') && (
          <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
            <p className='text-sm text-yellow-800'>
              <strong>Current Input:</strong> {data.human_readable}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}