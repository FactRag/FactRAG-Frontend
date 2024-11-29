// components/verification/ScoreLegend.tsx
import React from 'react'

export const ScoreLegend: React.FC = () => (
  <div className='mt-4 px-4 py-3 bg-gray-50 rounded-lg'>
    <p className='text-xs text-gray-600 font-medium mb-2'>Score Range Legend:</p>
    <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-xs'>
      <ScoreLegendItem color='bg-green-600' range='0.8-1.0' label='High Relevance' />
      <ScoreLegendItem color='bg-blue-600' range='0.6-0.8' label='Good Match' />
      <ScoreLegendItem color='bg-yellow-600' range='0.4-0.6' label='Moderate' />
      <ScoreLegendItem color='bg-red-600' range='<0.4' label='Low Relevance' />
    </div>
  </div>
)

const ScoreLegendItem: React.FC<{
  color: string;
  range: string;
  label: string;
}> = ({ color, range, label }) => (
  <span className='flex items-center'>
    <span className={`w-3 h-3 rounded-full ${color} mr-2`}></span>
    <span>{range}: {label}</span>
  </span>
)