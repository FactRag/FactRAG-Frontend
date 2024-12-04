import React, { useMemo } from 'react'
import { Badge, Card, Popover } from 'flowbite-react'
import { HiInformationCircle } from 'react-icons/hi'
import { Analysis, ErrorAnalysis } from '../../types/verification'

interface AnalysisCardProps {
  analysis: Analysis & {
    errors: Record<string, ErrorAnalysis>;
  };
}

interface CategoryContentProps {
  title: string;
  description: string;
}

const categoriesList: CategoryContentProps[] = [
  {
    "title": 'UnLabeled',
    "description": 'The information or context provided does not contain the claimed details, such as references to specific individuals, places, or events that are purportedly associated with the topic.'
  },
  {
    "title": 'Relation Errors',
    "description": 'Errors arise from misstatements regarding relationships between people, such as marital status or religious affiliations that conflict with the provided details.'
  },
  {
    "title": 'Role Attribution Errors',
    "description": 'Errors are due to incorrect associations of individuals with particular roles, places, or teams that do not match the details in the context.'
  },
  {
    "title": 'Geographic/Nationality Errors',
    "description": 'This category includes errors related to locations, national affiliations, or settings that do not align with the context or provide contradictory information.'
  },
  {
    "title": 'Genre/Classification Errors',
    "description": 'Misclassifications of films, genres, or roles are highlighted here, especially when certain works are wrongly associated with people, studios, or genres.'
  },
  {
    "title": 'Identifier/Biographical Errors',
    "description": 'These errors involve incorrect identifiers or biographical details, such as award titles, label names, or authorship that don’t match the context.\n'
  }
]

const MODEL_COLORS: Record<string, string> = {
  'gemma2': 'yellow',
  'llama3.1': 'purple',
  'qwen2.5': 'blue',
  'default': 'gray'
}

const content: React.FC<CategoryContentProps> = ({ title, description }) => (
  <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
    <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <div className="px-3 py-2">
      <p>{description}</p>
    </div>
  </div>
)

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  // Memoize computed values
  const { hasErrors, hasClassification, gridCols } = useMemo(() => {
    const hasErrors = Object.keys(analysis.errors).length > 0
    const hasClassification = analysis.stratum !== '-' || analysis.topic !== '-'
    const gridCols = (hasErrors ? 1 : 0) + (hasClassification ? 1 : 0)
    return { hasErrors, hasClassification, gridCols }
  }, [analysis.errors, analysis.stratum, analysis.topic])

  // Early return if no content to display
  if (!hasErrors && !hasClassification) {
    return null
  }

  const getModelColor = (model: string): string => MODEL_COLORS[model] || MODEL_COLORS.default

  return (
    <div className={`grid grid-cols-1 ${gridCols > 1 ? 'md:grid-cols-2' : ''} gap-4 mb-4`}>
      {hasErrors && (
        <Card className='p-4 bg-white shadow-sm'>
          <div className='space-y-4'>
            <h3 className='text-lg font-bold text-gray-800 mb-2 flex items-center'>
              <HiInformationCircle className='w-5 h-5 mr-2 text-blue-500' />
              Error Analysis
            </h3>
            <div className='space-y-4'>
              {Object.entries(analysis.errors).map(([model, error]) => (
                <div
                  key={model}
                  className='p-4 rounded-lg bg-gray-50 border border-gray-200'
                >
                  <div className='flex items-center justify-between mb-2'>
                    <Badge color={getModelColor(model)} size='sm'>
                      {model}
                    </Badge>
                    <Badge color='gray' size='sm'>
                      <Popover
                        trigger='hover'
                        content={content(categoriesList[error.category + 1])}
                      >
                        <a href='#' className='text-blue-600 underline hover:no-underline dark:text-blue-500'>
                          {categoriesList[error.category + 1]['title']}
                        </a>
                      </Popover>
                    </Badge>
                  </div>
                  <p className='text-sm text-gray-600'>
                    {error.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {hasClassification && (
        <Card className='p-4 bg-white shadow-sm'>
          <div className='space-y-3'>
            <h3 className='text-lg font-bold text-gray-800 mb-2 flex items-center'>
              <HiInformationCircle className='w-5 h-5 mr-2 text-blue-500' />
              Classification
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              {analysis.stratum !== '-' && (
                <div>
                  <Badge color='green'>Stratum</Badge>
                  <p className='text-sm mt-1'>{analysis.stratum}</p>
                </div>
              )}
              {analysis.topic !== '-' && (
                <div>
                  <Badge color='yellow'>Topic</Badge>
                  <p className='text-sm mt-1'>{analysis.topic}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}