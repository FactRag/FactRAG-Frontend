import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {HistorySidebar} from "../components/verification/HistorySidebar";
import VerificationProcess from "../components/verification/VerificationProcess";
import {FeedbackSection} from "../components/verification/FeedbackSection";
import {VerificationData} from "../types";
import {SearchHistory, SearchHistoryItem} from "../components/verification/History";


export const ResultsPage = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<VerificationData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [history, setHistory] = useState<SearchHistoryItem[]>([]);


    const STEP_DELAY = 1500;
    const steps = [
        'tripleProcessing',
        'humanReadable',
        'questions',
        'googlePages',
        'selectedDocs',
        'llmSubmission',
        'tieBreaker',
        'finalDecision'
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                const searchTerm = searchParams.get('search');
                const dataset = searchParams.get('dataset');

                if (!searchTerm || !dataset) {
                    throw new Error('Missing search parameters');
                }

                const response = await fetch(`/data/${dataset}/${searchTerm}.json`);
                if (!response.ok) throw new Error('Failed to fetch data');

                const verificationData = await response.json();
                setData(verificationData);

                // Simulate step-by-step loading
                for (let i = 0; i < steps.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, STEP_DELAY));
                    setCurrentStep(i + 1);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        loadData().then(r => r);
    }, [searchParams]);

    useEffect(() => {
        if (data) {
            const searchTerm = searchParams.get('search');
            const dataset = searchParams.get('dataset');

            if (searchTerm && dataset) {
                SearchHistory.addToHistory(searchTerm, dataset, data.human_readable);
                setHistory(SearchHistory.getHistory());
            }
        }
    }, [data, searchParams]);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <HistorySidebar history={history} setHistory={setHistory}/>
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {data && (
                        <>
                            <VerificationProcess
                                data={data}
                                currentStep={currentStep}
                                // steps={steps}
                            />
                            <FeedbackSection
                                searchTerm={searchParams.get('search')!}
                                dataset={searchParams.get('dataset')!}
                            />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};