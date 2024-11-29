import React, { memo, useMemo } from 'react'
import { Alert, Badge } from 'flowbite-react'
import { HiThumbDown, HiThumbUp, HiX } from 'react-icons/hi'

interface ModelResponseProps {
  model: string;
  response: {
    short_ans: number;
    full_ans: string;
  };
}

export const ModelResponseHeader: React.FC<{ stats: any }> = ({ stats }) => (
  <div className='flex justify-between items-center mb-4'>
    <h4 className='text-xl font-bold text-gray-900'>Model Verification Results</h4>
    <Alert color='info' className='p-2'>
      <div className='flex items-center gap-2'>
                <span className='font-medium text-sm'>
                  {stats.verified} Verified, {stats.notVerified} Not Verified
                  {stats.noAnswer > 0 && `, ${stats.noAnswer} No Answer`}
                </span>
      </div>
    </Alert>
  </div>
)

export const ModelResponse = memo<ModelResponseProps>(({ model, response }) => {
  const config = useMemo(() => {
    switch (response.short_ans) {
      case 1:
        return {
          icon: <HiThumbUp className='w-5 h-5 text-green-600' />,
          bgColor: 'bg-green-100',
          badge: { color: 'success', text: 'Verified' }
        }
      case 0:
        return {
          icon: <HiThumbDown className='w-5 h-5 text-red-600' />,
          bgColor: 'bg-red-100',
          badge: { color: 'failure', text: 'Not Verified' }
        }
      default:
        return {
          icon: <HiX className='w-5 h-5 text-gray-600' />,
          bgColor: 'bg-gray-100',
          badge: { color: 'gray', text: 'No Answer' }
        }
    }
  }, [response.short_ans])

  return (
    <div
      className='flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow'
      data-testid='model-response'
    >
      <div className='flex items-center space-x-4'>
        <div className={`p-2 rounded-lg ${config.bgColor}`}>{config.icon}</div>
        <div>
          <h5 className='text-lg font-semibold text-gray-900'>{model}</h5>
          <Badge color={config.badge.color as any} className='mt-1'>
            {config.badge.text}
          </Badge>
        </div>
      </div>

      <div className='text-sm max-w-xl'>
        <div className='text-gray-600 mb-1'>Reasoning:</div>
        <div className='text-gray-800'>{response.full_ans}</div>
      </div>
    </div>
  )
})

ModelResponse.displayName = 'ModelResponse'
