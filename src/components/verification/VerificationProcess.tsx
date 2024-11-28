import React, {useEffect, useState} from 'react';
import {Timeline, Card, Alert, Modal} from 'flowbite-react';
import {HiExternalLink, HiInformationCircle, HiOutlineExternalLink, HiOutlineDocumentText, HiEye, HiX} from 'react-icons/hi';
import {VerificationData} from '../../types';

interface ProcessStep {
    id: string;
    title: string;
    description?: string;
    prompt?: string;
    examples?: { input: string; output: string }[];
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
];

interface VerificationProcessProps {
    data: VerificationData;
    currentStep: number;
}

export const VerificationProcess: React.FC<VerificationProcessProps> = ({data, currentStep}) => {
    const [pageModal, setPageModal] = useState<{ isOpen: boolean; url: string; html: string }>({
        isOpen: false,
        url: '',
        html: ''
    });

    const [docModal, setDocModal] = useState<{ isOpen: boolean; file_id: string; docContent: string }>({
        isOpen: false,
        file_id: '',
        docContent: ''
    });


    useEffect(() => {
        const loadDocContent = async () => {
            if (docModal.file_id) {
                // setIsLoading(true);
                try {
                    const response = await fetch(`/data/txt/${docModal.file_id}`);
                    if (!response.ok) throw new Error('Failed to load document');
                    const content = await response.text();
                    setDocModal({isOpen: true, file_id: docModal.file_id, docContent: content});
                } catch (error) {
                    console.error('Error loading document:', error);
                    setDocModal({isOpen: false, file_id: '', docContent: ''});
                } finally {
                    // setIsLoading(false);
                }
            }
        };

        if (docModal.file_id) {
            loadDocContent().then(r => r);
        }
    }, [docModal.file_id]);

    const renderTripleContent = () => (
        <Card className="mb-4">
            <div className="space-y-2">
                <p><span className="font-semibold">Subject:</span> {data.subject}</p>
                <p><span className="font-semibold">Predicate:</span> {data.predicate}</p>
                <p><span className="font-semibold">Object:</span> {data.object}</p>
            </div>
        </Card>
    );

    const getFileName = (fileId: string) => {
        // Extract just the filename without path
        return fileId.split('/').pop() || fileId;
    };

    const renderHumanReadableContent = () => {
        const promptContent = `Task Description: Convert a knowledge graph triple into a meaningful human-readable sentence.

Instructions: Given a subject, predicate, and object from a knowledge graph, form a grammatically correct and meaningful sentence that conveys the relationship between them.

Examples:
Input:
Subject: Alexander_III_of_Russia
Predicate: isMarriedTo
Object: Maria_Feodorovna__Dagmar_of_Denmark_
Output: {"output": "Alexander III of Russia is married to Maria Feodorovna, also known as Dagmar of Denmark."}

Subject: Quentin_Tarantino
Predicate: produced
Object: From_Dusk_till_Dawn
Output: {"output": "Quentin Tarantino produced the film From Dusk till Dawn."}

Do the following:
Input:
Subject: ${data.subject}
Predicate: ${data.predicate}
Object: ${data.object}

The output should be a JSON object with the key "output" and the value as the sentence. The sentence should be human-readable and grammatically correct.
    `;

        return (
            <Card className="mb-4">
                {/* Prompt Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-700">Sentence Generation Prompt</h3>
                        <button
                            className="text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => {
                                const details = document.getElementById('sentencePromptDetails');
                                if (details) {
                                    details.style.display = details.style.display === 'none' ? 'block' : 'none';
                                }
                            }}
                        >
                            Show/Hide Details
                        </button>
                    </div>

                    <div id="sentencePromptDetails" className="hidden">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap">{promptContent}</pre>
                        </div>
                    </div>
                </div>

                {/* Output Display */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3">Input Triple</th>
                            <th scope="col" className="px-4 py-3">Human Readable Output</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="border-b">
                            <td className="px-4 py-3">
                                <div className="space-y-1">
                                    <div className="text-xs text-gray-500">Subject</div>
                                    <div className="font-medium text-gray-900">{data.subject}</div>
                                    <div className="text-xs text-gray-500 mt-2">Predicate</div>
                                    <div className="font-medium text-gray-900">{data.predicate}</div>
                                    <div className="text-xs text-gray-500 mt-2">Object</div>
                                    <div className="font-medium text-gray-900">{data.object}</div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <div className="text-xs text-blue-600 mb-1">Generated Sentence</div>
                                    <div className="font-medium text-blue-900">{data.human_readable}</div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                    Format: <code
                                    className="bg-gray-100 px-1 py-0.5 rounded">{"{'output': '...'}"}</code>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Legend */}
                <div className="mt-4 px-4 py-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium mb-2">Process Overview:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
              <span>1. Parse Input Triple</span>
            </span>
                        <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-400 mr-2"></span>
              <span>2. Generate Natural Language</span>
            </span>
                        <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-400 mr-2"></span>
              <span>3. Format JSON Response</span>
            </span>
                    </div>
                </div>
            </Card>
        );
    };


    const renderQuestionsContent = () => {
        // Sort questions by score in descending order
        const sortedQuestions = [...data.questions].sort((a, b) => Number(b.score) - Number(a.score));
        const promptContent = `You are an intelligent system with access to a vast amount of information. I will provide you with a knowledge graph in the form of triples (subject, predicate, object). 

Your task is to generate ten questions based on the knowledge graph. The questions should assess understanding and insight into the information presented in the graph. Provide the output in JSON format, with each question having a unique identifier.

Instructions:
    1. Analyze the provided knowledge graph.
    2. Generate ten questions that are relevant to the information in the knowledge graph.
    3. Provide the questions in JSON format, each with a unique identifier.

Examples:
Albert Einstein bornIn Ulm
Expected Response:
    {
        "questions": [
          {"id": 1, "question": "Where was Albert Einstein born?"},
          {"id": 2, "question": "What is Albert Einstein known for?"},
          {"id": 3, "question": "In what year was the Theory of Relativity published?"},
          {"id": 4, "question": "Where did Albert Einstein work?"},
          {"id": 5, "question": "What prestigious award did Albert Einstein win?"},
          {"id": 6, "question": "Which theory is associated with Albert Einstein?"},
          {"id": 7, "question": "Which university did Albert Einstein work at?"},
          {"id": 8, "question": "What did Albert Einstein receive the Nobel Prize in?"},
          {"id": 9, "question": "In what field did Albert Einstein win a Nobel Prize?"},
          {"id": 10, "question": "Name the city where Albert Einstein was born."}
        ]
    }
    `;
        return (
            <Card className="mb-4">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-700">Question Generation Prompt</h3>
                        <button
                            className="text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => {
                                const details = document.getElementById('promptDetails');
                                if (details) {
                                    details.style.display = details.style.display === 'none' ? 'block' : 'none';
                                }
                            }}
                        >
                            Show/Hide Prompt
                        </button>
                    </div>
                    <div id="promptDetails" className="hidden">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap">{promptContent}</pre>
                        </div>
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Current Input:</strong> {data.human_readable}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3">Rank</th>
                            <th scope="col" className="px-4 py-3">Question</th>
                            <th scope="col" className="px-4 py-3 text-right">Score</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        {sortedQuestions.map((q, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-3 w-16">
                                    {idx < 3 && (
                                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full 
                        ${idx === 0 ? 'bg-yellow-100 text-yellow-800' :
                                            idx === 1 ? 'bg-gray-100 text-gray-800' :
                                                'bg-amber-100 text-amber-800'}`}>
                        {idx + 1}
                      </span>
                                    )}
                                    {idx >= 3 && (
                                        <span className="text-gray-500">{idx + 1}</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center">
                                        <span className="font-medium text-gray-900">{q.question}</span>
                                        {idx < 3 && (
                                            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                          ${idx === 0 ? 'bg-yellow-100 text-yellow-800' :
                                                idx === 1 ? 'bg-gray-100 text-gray-800' :
                                                    'bg-amber-100 text-amber-800'}`}>
                          {idx === 0 ? 'Best Match' :
                              idx === 1 ? 'Second Best' :
                                  'Third Best'}
                        </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right font-mono">
                    <span className={`
                      ${idx < 3 ? 'font-bold' : ''} 
                      ${Number(q.score) >= 0.8 ? 'text-green-600' :
                        Number(q.score) >= 0.6 ? 'text-blue-600' :
                            Number(q.score) >= 0.4 ? 'text-yellow-600' :
                                'text-red-600'}`}>
                      {Number(q.score).toFixed(4)}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Score Legend */}
                <div className="mt-4 px-4 py-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium mb-2">Score Range Legend:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-600 mr-2"></span>
              <span>0.8-1.0: High Relevance</span>
            </span>
                        <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
              <span>0.6-0.8: Good Match</span>
            </span>
                        <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-600 mr-2"></span>
              <span>0.4-0.6: Moderate</span>
            </span>
                        <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-600 mr-2"></span>
              <span>&lt;0.4: Low Relevance</span>
            </span>
                    </div>
                </div>
            </Card>
        );
    };
    const renderGooglePagesContent = () => (
        <Card className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.google_pages.map((page, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow flex flex-col"
                    >
                        <div className="flex items-start justify-between mb-3">
                <span
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                  Source {idx + 1}
                </span>
                            <a
                                href={page.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                <HiExternalLink className="w-4 h-4"/>
                            </a>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
                            {new URL(page.url).hostname}
                        </p>

                        <button
                            onClick={() => setPageModal({isOpen: true, url: page.url, html: page.html})}
                            className="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            View Content
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    );

    const renderSelectedDocsContent = () => (
        <Card className="mb-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Selected Documents</h3>
                <span className="text-sm text-gray-500">
            {data.selected_docs.length} document{data.selected_docs.length !== 1 ? 's' : ''}
          </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {data.selected_docs.map((doc, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all p-4 flex flex-col items-center cursor-pointer"
                        onClick={() => setDocModal({isOpen: true, file_id: doc.file_id, docContent: ''})}
                    >
                        <div className="text-blue-600 mb-2">
                            <HiOutlineDocumentText className="w-8 h-8" />
                        </div>

                        <p className="text-xs text-gray-500 text-center mb-2">
                            Document {idx + 1}
                        </p>

                        <p className="text-sm text-gray-900 font-medium mb-3 text-center truncate w-full">
                            {getFileName(doc.file_id)}
                        </p>

                        <button
                            className="flex items-center justify-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <HiEye className="w-4 h-4 mr-1" />
                            View Content
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    )
    const renderModelResponses = () => (
        <Card className="mb-4">
            <div className="space-y-4">
                {Object.entries(data.responses).map(([model, response], idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                        <h5 className="font-bold text-gray-900 mb-2">{model}</h5>
                        <p className="text-gray-700">{response.short_ans}</p>
                        <p className="text-sm text-gray-500 mt-2">Confidence: {response.full_ans}</p>
                    </div>
                ))}
            </div>
        </Card>
    );

    const renderFinalAnalysis = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card>
                <h5 className="text-lg font-bold mb-4">Error Analysis</h5>
                <div className="space-y-2">
                    <p><span className="font-semibold">Category:</span> {data.analysis.error_category}</p>
                    <p><span className="font-semibold">Detail:</span> {data.analysis.error_detail}</p>
                </div>
            </Card>
            <Card>
                <h5 className="text-lg font-bold mb-4">Classification</h5>
                <div className="space-y-2">
                    <p><span className="font-semibold">Category:</span> {data.analysis.category}</p>
                    <p><span className="font-semibold">Stratum:</span> {data.analysis.stratum}</p>
                    <p><span className="font-semibold">Topic:</span> {data.analysis.topic}</p>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <Alert
                color={data.final_decision === "true" ? "success" : "failure"}
                icon={HiInformationCircle}
                className="mb-4"
            >
        <span className="font-medium">
          {data.final_decision === "true" ? "VERIFIED" : "NOT VERIFIED"}
        </span>
            </Alert>

            <Timeline>
                {VERIFICATION_STEPS.map((step, index) => (
                    <Timeline.Item key={step.id}>
                        <Timeline.Point/>
                        <Timeline.Content>
                            <Timeline.Time>
                                {step.description && (
                                    <span className="text-sm text-gray-500">{step.description}</span>
                                )}
                            </Timeline.Time>
                            <Timeline.Title>{step.title}</Timeline.Title>
                            <Timeline.Body>
                                <div className={`transition-opacity duration-300 ${
                                    index <= currentStep ? 'opacity-100' : 'opacity-0'
                                }`}>
                                    {index === 0 && renderTripleContent()}
                                    {index === 1 && renderHumanReadableContent()}
                                    {index === 2 && renderQuestionsContent()}
                                    {index === 3 && renderGooglePagesContent()}
                                    {index === 4 && renderSelectedDocsContent()}
                                    {index === 5 && renderModelResponses()}
                                    {index === 7 && renderFinalAnalysis()}
                                </div>
                            </Timeline.Body>
                        </Timeline.Content>
                    </Timeline.Item>
                ))}
            </Timeline>

            <Modal
                show={pageModal.isOpen}
                onClose={() => setPageModal({isOpen: false, url: '', html: ''})}
                size="5xl"
            >
                <Modal.Header>Search Result Content</Modal.Header>
                <Modal.Body>
                    <div className="mb-4">
                        <a
                            href={pageModal.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                        >
                            View original page
                            <HiOutlineExternalLink className="ml-2"/>
                        </a>
                    </div>
                    <div className="w-full h-[70vh] overflow-hidden">
                        <div className="relative w-full h-full">
                        <iframe
                            src={`./data/html/${pageModal.html}`}
                            className="w-full h-full border rounded-lg"
                            style={{
                                 overflow: 'auto',
                                 overflowX: 'hidden'
                            }}
                            title="Page Content"
                        />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                show={docModal.isOpen}
                onClose={() => setDocModal({isOpen: false, file_id: '', docContent: ''})}
                size="4xl"
                theme={{
                    content: {
                        base: "relative h-[80vh] w-full rounded-lg bg-white shadow flex flex-col"
                    }
                }}
            >
                <Modal.Header>
                    <div className="flex items-center justify-between w-full">
                        <h3 className="text-lg font-semibold text-gray-900 flex-grow truncate pr-4">
                            {docModal.file_id && getFileName(docModal.file_id)}
                        </h3>
                        {/*<button*/}
                        {/*    onClick={() => {*/}
                        {/*        setSelectedDoc(null);*/}
                        {/*        setDocContent('');*/}
                        {/*    }}*/}
                        {/*    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"*/}
                        {/*>*/}
                        {/*    <HiX className="w-5 h-5 text-gray-500" />*/}
                        {/*</button>*/}
                    </div>
                </Modal.Header>

                <Modal.Body className="p-4 flex-grow overflow-hidden relative">
                    {docModal.docContent == "" ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="h-full overflow-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-lg">
                {docModal.docContent}
              </pre>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default VerificationProcess;
