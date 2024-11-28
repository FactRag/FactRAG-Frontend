import React, { useState, useEffect } from 'react';
import { Card, Button, Textarea, Alert, Modal } from 'flowbite-react';
import {
    HiThumbUp,
    HiThumbDown,
    HiQuestionMarkCircle,
    HiAcademicCap,
    HiUser,
    HiX
} from 'react-icons/hi';

interface FeedbackResponse {
    id: number;
    user: {
        name: string;
        avatar: string;
    };
    feedback: 'agree' | 'disagree' | 'uncertain';
    comment: string;
    timestamp: string;
}

interface FeedbackStats {
    agree: number;
    disagree: number;
    uncertain: number;
    total: number;
}

interface FeedbackSectionProps {
    searchTerm: string;
    dataset: string;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ searchTerm, dataset }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [feedback, setFeedback] = useState<'agree' | 'disagree' | 'uncertain' | null>(null);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [stats, setStats] = useState<FeedbackStats>({
        agree: 0,
        disagree: 0,
        uncertain: 0,
        total: 0
    });
    const [history, setHistory] = useState<FeedbackResponse[]>([]);

    useEffect(() => {
        checkAuthStatus();
        fetchStats();
        fetchHistory();
    }, [searchTerm, dataset]);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/auth/status/');
            const data = await response.json();
            setIsAuthenticated(data.isAuthenticated);
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(
                `/feedback/stats/?search=${searchTerm}&dataset=${dataset}`
            );
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await fetch(
                `/feedback/history/?search=${searchTerm}&dataset=${dataset}`
            );
            const data = await response.json();
            setHistory(data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const handleSubmit = async () => {
        if (!feedback || !isAuthenticated) return;

        try {
            const response = await fetch('/feedback/submit/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchTerm,
                    dataset,
                    feedback,
                    comment
                }),
            });

            if (response.ok) {
                setSubmitted(true);
                fetchStats();
                fetchHistory();
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    const AuthModal = () => (
        <Modal
            show={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            size="md"
        >
            <Modal.Header>
                <div className="flex justify-between items-center w-full">
                    <span className="text-xl font-semibold">Authentication Required</span>
                    <Button
                        color="gray"
                        size="sm"
                        onClick={() => setShowAuthModal(false)}
                    >
                        <HiX className="w-4 h-4" />
                    </Button>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-4">
                    <Button
                        color="light"
                        className="w-full flex items-center justify-center"
                        onClick={() => window.location.href = '/auth/google/login'}
                    >
                        <HiThumbDown className="mr-2 h-5 w-5" />
                        Continue with Google TODO
                    </Button>
                    <Button
                        color="light"
                        className="w-full flex items-center justify-center"
                        onClick={() => window.location.href = '/auth/orcid/login'}
                    >
                        <HiAcademicCap className="mr-2 h-5 w-5" />
                        Continue with ORCID
                    </Button>
                    <Button
                        color="dark"
                        className="w-full flex items-center justify-center"
                        onClick={() => window.location.href = '/auth/test/login'}
                    >
                        <HiUser className="mr-2 h-5 w-5" />
                        Test Login (Username/Password)
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );

    return (
        <Card className="mt-8">
            <div className="space-y-6">
                <h2 className="text-xl font-bold">Community Feedback</h2>

                {!isAuthenticated ? (
                    <Alert color="info">
                        <div className="flex flex-col items-center space-y-4">
                            <span>Please log in to provide feedback</span>
                            <Button color="blue" onClick={() => setShowAuthModal(true)}>
                                Log in
                            </Button>
                        </div>
                    </Alert>
                ) : (
                    submitted ? (
                        <Alert color="success">
                            <span>Thank you for your feedback!</span>
                        </Alert>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-center gap-4">
                                <Button
                                    color={feedback === 'agree' ? 'success' : 'gray'}
                                    onClick={() => setFeedback('agree')}
                                >
                                    <HiThumbUp className="mr-2 h-5 w-5" />
                                    Agree
                                </Button>
                                <Button
                                    color={feedback === 'disagree' ? 'failure' : 'gray'}
                                    onClick={() => setFeedback('disagree')}
                                >
                                    <HiThumbDown className="mr-2 h-5 w-5" />
                                    Disagree
                                </Button>
                                <Button
                                    color={feedback === 'uncertain' ? 'warning' : 'gray'}
                                    onClick={() => setFeedback('uncertain')}
                                >
                                    <HiQuestionMarkCircle className="mr-2 h-5 w-5" />
                                    Uncertain
                                </Button>
                            </div>

                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add your comment (optional)"
                                rows={3}
                            />

                            <Button
                                color="blue"
                                className="w-full"
                                onClick={handleSubmit}
                                disabled={!feedback}
                            >
                                Submit Feedback
                            </Button>
                        </div>
                    )
                )}

                {/* Stats */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Feedback Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {Object.entries(stats).map(([key, value]) => {
                            if (key === 'total') return null;
                            return (
                                <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold">{value}</div>
                                    <div className="text-sm text-gray-600 capitalize">{key}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* History */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Recent Feedback</h3>
                    <div className="space-y-4">
                        {history.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                                No feedback submitted yet
                            </div>
                        ) : (
                            history.map((item) => (
                                <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img
                                                src={item.user.avatar}
                                                alt=""
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div className="ml-3">
                                                <p className="text-sm font-medium">{item.user.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(item.timestamp).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`
                      px-2 py-1 rounded-full text-sm
                      ${item.feedback === 'agree' ? 'bg-green-100 text-green-800' :
                                            item.feedback === 'disagree' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }
                    `}>
                      {item.feedback}
                    </span>
                                    </div>
                                    {item.comment && (
                                        <p className="mt-2 text-sm text-gray-600">{item.comment}</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <AuthModal />
        </Card>
    );
};

export default FeedbackSection;