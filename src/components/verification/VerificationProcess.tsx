import React, { useState } from 'react'
import { Alert, Badge, Card, Modal, Timeline } from 'flowbite-react'
import { HiInformationCircle, HiOutlineExternalLink } from 'react-icons/hi'
import { ModelResponse, ModelResponseHeader } from './ModelResponse'
import type { ProcessStep, VerificationData } from '../../types/verification'
import { useDocumentContent } from '../../hooks/useDocumentContent'
import { DocumentModal } from './modals/DocumentModal'
import { TripleDisplay } from './TripleDisplay'
import { DocumentCard } from './modals/DocumentCard'
import { GooglePageCard } from './GooglePageCard'
import { PromptSection } from './PromptSection'
import { QuestionTable } from './QuestionTable'
import { generateHumanReadablePrompt, generateQuestionPromptContent } from '../../utils/promptGenerators'
import { ScoreLegend } from './ScoreLegend'
import { ResponseDistribution } from './ResponseDistribution'
import { calculateModelStats } from '../../utils/calculateModelStats'
import { AnalysisCard } from './AnalysisCard.'

interface VerificationProcessProps {
  data: VerificationData;
  currentStep: number;
}

const VERIFICATION_STEPS: ProcessStep[] = [
  {
    id: 'tripleProcessing',
    title: 'Original Triple',
    description: 'Processing and analyzing the knowledge graph triple'
  },
  {
    id: 'humanReadable',
    title: 'Human Readable Format',
    prompt: 'Convert a knowledge graph triple into a meaningful human-readable sentence.',
    examples: [
      {
        input: `Subject: Alexander_III_of_Russia
Predicate: isMarriedTo
Object: Maria_Feodorovna__Dagmar_of_Denmark_`,
        output: 'Alexander III of Russia is married to Maria Feodorovna, also known as Dagmar of Denmark.'
      }
    ]
  },
  {
    id: 'questions',
    title: 'Generated Questions',
    description: 'Generating verification questions based on the triple',
    prompt: 'Generate insightful questions to verify the accuracy of the knowledge graph triple.'
  },
  {
    id: 'googlePages',
    title: 'Evidence Search',
    description: 'Searching and analyzing web evidence'
  },
  {
    id: 'selectedDocs',
    title: 'Document Analysis',
    description: 'Analyzing selected documents for verification'
  },
  {
    id: 'llmSubmission',
    title: 'Model Verification',
    description: 'Large Language Models analyzing evidence'
  },
  {
    id: 'tieBreaker',
    title: 'Consensus Check',
    description: 'Checking for consensus among model responses'
  },
  {
    id: 'finalDecision',
    title: 'Final Verification',
    description: 'Synthesizing final verification decision'
  }
]


export const VerificationProcess: React.FC<VerificationProcessProps> = ({ data, currentStep }) => {
  const [pageModal, setPageModal] = useState<{ isOpen: boolean; url: string; html: string }>({
    isOpen: false,
    url: '',
    html: ''
  })
  const { docModal, openDocument, closeDocument } = useDocumentContent()

  const renderFinalAnalysis = () => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
      <Card>
        <h5 className='text-lg font-bold mb-4'>Error Analysis</h5>
        <div className='space-y-2'>
          <p><span className='font-semibold'>Category:</span> {data.analysis.error_category}</p>
          <p><span className='font-semibold'>Detail:</span> {data.analysis.error_detail}</p>
        </div>
      </Card>
      <Card>
        <h5 className='text-lg font-bold mb-4'>Classification</h5>
        <div className='space-y-2'>
          <p><span className='font-semibold'>Category:</span> {data.analysis.category}</p>
          <p><span className='font-semibold'>Stratum:</span> {data.analysis.stratum}</p>
          <p><span className='font-semibold'>Topic:</span> {data.analysis.topic}</p>
        </div>
      </Card>
    </div>
  )

  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <TripleDisplay
            subject={data.subject}
            predicate={data.predicate}
            object={data.object}
          />
        )
      case 1:
        return (
          <Card className='mb-4'>
            <PromptSection
              title='Sentence Generation Prompt'
              content={generateHumanReadablePrompt(data)}
              data={data}
            />

            {/* Output Display */}
            <div className='overflow-x-auto'>
              <table className='w-full text-sm text-left'>
                <thead className='text-xs bg-gray-50'>
                <tr>
                  <th scope='col' className='px-4 py-3'>Input Triple</th>
                  <th scope='col' className='px-4 py-3'>Human Readable Output</th>
                </tr>
                </thead>
                <tbody>
                <tr className='border-b'>
                  <td className='px-4 py-3'>
                    <div className='space-y-1'>
                      <div className='text-xs text-gray-500'>Subject</div>
                      <div className='font-medium text-gray-900'>{data.subject}</div>
                      <div className='text-xs text-gray-500 mt-2'>Predicate</div>
                      <div className='font-medium text-gray-900'>{data.predicate}</div>
                      <div className='text-xs text-gray-500 mt-2'>Object</div>
                      <div className='font-medium text-gray-900'>{data.object}</div>
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='bg-blue-50 p-3 rounded-lg border border-blue-100'>
                      <div className='text-xs text-blue-600 mb-1'>Generated Sentence</div>
                      <div className='font-medium text-blue-900'>{data.human_readable}</div>
                    </div>
                    <div className='mt-2 text-xs text-gray-500'>
                      Format: <code
                      className='bg-gray-100 px-1 py-0.5 rounded'>{'{\'output\': \'...\'}'}</code>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className='mt-4 px-4 py-3 bg-gray-50 rounded-lg'>
              <p className='text-xs text-gray-600 font-medium mb-2'>Process Overview:</p>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-2 text-xs'>
                        <span className='flex items-center'>
                          <span className='w-3 h-3 rounded-full bg-gray-400 mr-2'></span>
                          <span>1. Parse Input Triple</span>
                        </span>
                <span className='flex items-center'>
                          <span className='w-3 h-3 rounded-full bg-blue-400 mr-2'></span>
                          <span>2. Generate Natural Language</span>
                        </span>
                <span className='flex items-center'>
                          <span className='w-3 h-3 rounded-full bg-green-400 mr-2'></span>
                          <span>3. Format JSON Response</span>
                        </span>
              </div>
            </div>
          </Card>
        )
      case 2:
        return (
          <Card className='mb-4'>
            <PromptSection
              title='Question Generation Prompt'
              content={generateQuestionPromptContent(data)}
              data={data}
            />
            <QuestionTable questions={data.questions} />
            <ScoreLegend />
          </Card>
        )
      case 3:
        return (
          <Card className='mb-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {data.google_pages.map((page, idx) => (
                <GooglePageCard
                  key={idx}
                  page={page}
                  index={idx}
                  onView={() => setPageModal({
                    isOpen: true,
                    url: page.url,
                    html: page.html
                  })}
                />
              ))}
            </div>
          </Card>
        )
      case 4:
        return (
          <Card className='mb-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-bold text-gray-900'>Selected Documents</h3>
              <span className='text-sm text-gray-500'>
                              {data.selected_docs.length} document{data.selected_docs.length !== 1 ? 's' : ''}
                            </span>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
              {data.selected_docs.map((doc, idx) => (
                <DocumentCard
                  key={idx}
                  doc={doc}
                  index={idx}
                  onView={() => openDocument(doc.file_id)}
                />
              ))}
            </div>
          </Card>
        )
      case 5: {
        const modelStats = calculateModelStats(data.responses)

        return (
          <Card className='mb-4'>
            <div className='space-y-4'>
              <ModelResponseHeader stats={modelStats} />

              <div className='space-y-3'>
                {Object.entries(data.responses).map(([model, response], idx) => (
                  <ModelResponse
                    key={`${model}-${idx}`}
                    model={model}
                    response={response}
                  />
                ))}
              </div>

              <ResponseDistribution stats={modelStats} />
            </div>
          </Card>
        )
      }
      case 6:
        if (data.need_tiebreaker) {
          return (
            <Card className='mb-4'>
              <div className='space-y-4'>
                <div className='flex justify-between items-center mb-4'>
                  <h4 className='text-xl font-bold text-gray-900'>Tiebreaker Verification</h4>
                  <Badge color='purple'>Consensus Check</Badge>
                </div>

                <div className='space-y-3'>
                  {Object.entries(data.tiebreakers_responses).map(([model, response], idx) => (
                    <ModelResponse
                      key={`tiebreaker-${model}-${idx}`}
                      model={model}
                      response={response}
                    />
                  ))}
                </div>

                {/*<ResponseDistribution stats={tieStats} />*/}
              </div>
            </Card>
          )
        }
        return
      case 7:
        return <AnalysisCard analysis={data.analysis}/>
      default:
        return null
    }
  }

  const final_decision_color = data.need_tiebreaker ? 'indigo' : data.final_decision === 'true' ? 'success' : 'failure'
  const final_decision_text = data.need_tiebreaker ? 'Tiebreaker Required' : data.final_decision === 'true' ? 'Verified' : 'Not Verified'
  return (
    <div className='max-w-4xl mx-auto'>
      <Alert
        color={final_decision_color}
        icon={HiInformationCircle}
        className='mb-4'
      >
        <span className='font-medium'>
          {final_decision_text}
        </span>
      </Alert>

      <Timeline>
        {VERIFICATION_STEPS.map((step, index) => (
          <Timeline.Item key={step.id}>
            <Timeline.Point />
            <Timeline.Content>
              <Timeline.Time>
                {step.description && (
                  <span className='text-sm text-gray-500'>{step.description}</span>
                )}
              </Timeline.Time>
              <Timeline.Title>{step.title}</Timeline.Title>
              <Timeline.Body>
                <div
                  className={`transition-opacity duration-300 ${
                    index <= currentStep ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {renderStepContent(index)}
                </div>
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
        ))}
      </Timeline>

      <Modal
        show={pageModal.isOpen}
        onClose={() => setPageModal({ isOpen: false, url: '', html: '' })}
        size='5xl'
      >
        <Modal.Header>Search Result Content</Modal.Header>
        <Modal.Body>
          <div className='mb-4'>
            <a
              href={pageModal.url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline flex items-center'
            >
              View original page
              <HiOutlineExternalLink className='ml-2' />
            </a>
          </div>
          <div className='w-full h-[70vh] overflow-hidden'>
            <div className='relative w-full h-full'>
              <iframe
                src={`./data/html/${pageModal.html}`}
                className='w-full h-full border rounded-lg'
                style={{
                  overflow: 'auto',
                  overflowX: 'hidden'
                }}
                title='Page Content'
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <DocumentModal
        isOpen={docModal.isOpen}
        onClose={closeDocument}
        fileId={docModal.fileId}
        content={docModal.content}
        isLoading={docModal.isLoading}
      />
    </div>
  )
}

export default VerificationProcess
