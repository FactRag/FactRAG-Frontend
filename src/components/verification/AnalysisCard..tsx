import { Badge, Card } from 'flowbite-react'
import { HiInformationCircle } from 'react-icons/hi'
import { Analysis } from '../../types/verification'
import React from 'react'

export const AnalysisCard: React.FC<{ analysis: Analysis }> = ({ analysis }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    {/* Left Column */}
    <Card className="p-4 bg-white shadow-sm">
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
          <HiInformationCircle className="w-5 h-5 mr-2 text-blue-500" />
          Error Analysis
        </h3>
        <div className="flex items-center space-x-2">
          <Badge color="purple" className="whitespace-nowrap">
            {analysis.error_category}
          </Badge>
          <p className="text-sm text-gray-600">{analysis.error_detail}</p>
        </div>
        {analysis.error_reason && (
          <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {analysis.error_reason}
          </div>
        )}
      </div>
    </Card>

    {/* Right Column */}
    <Card className="p-4 bg-white shadow-sm">
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
          <HiInformationCircle className="w-5 h-5 mr-2 text-blue-500" />
          Classification
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Badge color="blue">Category</Badge>
            <p className="text-sm mt-1">{analysis.category}</p>
          </div>
          <div>
            <Badge color="green">Stratum</Badge>
            <p className="text-sm mt-1">{analysis.stratum}</p>
          </div>
          <div>
            <Badge color="yellow">Topic</Badge>
            <p className="text-sm mt-1">{analysis.topic}</p>
          </div>
        </div>
      </div>
    </Card>
  </div>
);