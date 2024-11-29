import React from 'react'

export const ResponseDistribution: React.FC<{ stats: any }> = ({ stats }) => (
  <div className='mt-4 p-3 bg-gray-50 rounded-lg'>
    <div className='text-sm text-gray-600'>
      <span className='font-semibold'>Response Distribution:</span>
      <div className='w-full h-2.5 mt-2 rounded-full overflow-hidden bg-gray-200 flex'>
        <div
          className='h-full bg-green-600 transition-all duration-300'
          style={{ width: `${stats.verifiedRate}%` }}
        />
        <div
          className='h-full bg-red-600 transition-all duration-300'
          style={{ width: `${stats.notVerifiedRate}%` }}
        />
      </div>
      <div className='flex justify-between mt-2'>
        <span>Verified: {stats.verifiedRate.toFixed(1)}%</span>
        <span>Not Verified: {stats.notVerifiedRate.toFixed(1)}%</span>
      </div>
      {stats.noAnswer > 0 && (
        <div className='mt-2 text-gray-500 text-xs'>
          * {stats.noAnswer} model{stats.noAnswer > 1 ? 's' : ''} provided no answer
        </div>
      )}
    </div>
  </div>
)
