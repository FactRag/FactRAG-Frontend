import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import {Button, Textarea, Avatar, Alert, Badge, Label, TextInput} from 'flowbite-react';
import {MessageCircle, X, ThumbsUp, ThumbsDown, LogIn, Mail} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {API_BASE_URL, AUTH_PROVIDERS, EMOJIS, FEEDBACK_TYPES} from '../../config';
import {Feedback, FeedbackStats, FeedbackType} from "../../types";

interface FeedbackSectionProps {
    searchTerm: string;
    dataset: string;
}

interface FeedbackSubmission {
    searchTerm: string;
    dataset: string;
    feedback: string;
    comment: string;
    isPublic: boolean;
}

const AuthSection = () => {
    const {
        isAuthenticated,
        loginWithEmail,
        socialLogin
    } = useAuth();

    const [showEmailLogin, setShowEmailLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginWithEmail({ email, password });
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            setShowEmailLogin(false);
            setEmail('');
            setPassword('');
        }
    }, [isAuthenticated]);

    return (
        <div className="p-6 space-y-4 feedback-item">
            <div className="text-center mb-4">
                <LogIn className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-900">Sign in to continue</h3>
                <p className="text-sm text-gray-500">Authentication required for feedback</p>
            </div>

            {!showEmailLogin ? (
                <>
                    <div className="space-y-3">
                        <Button
                            color="light"
                            className="w-full"
                            onClick={() => socialLogin('google')}
                        >
                            <img src="/static/google-icon.svg" className="w-5 h-5 mr-2" alt="Google" />
                            Continue with Google
                        </Button>

                        <Button
                            color="light"
                            className="w-full"
                            onClick={() => socialLogin('orcid')}
                        >
                            <img src="/static/orcid-icon.svg" className="w-5 h-5 mr-2" alt="ORCID" />
                            Continue with ORCID
                        </Button>

                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-full border-t border-gray-300"></div>
                            <div className="relative bg-white px-4">
                                <span className="text-sm text-gray-500">Or</span>
                            </div>
                        </div>

                        <Button
                            color="light"
                            className="w-full"
                            onClick={() => setShowEmailLogin(true)}
                        >
                            <Mail className="w-5 h-5 mr-2" />
                            Continue with Email
                        </Button>
                    </div>
                </>
            ) : (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <TextInput
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <TextInput
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" color="dark" className="w-full">
                        Sign In
                    </Button>
                    <Button
                        color="light"
                        className="w-full"
                        onClick={() => setShowEmailLogin(false)}
                    >
                        Back to social login
                    </Button>
                </form>
            )}
        </div>
    );
};

// Memoized Emoji Button Component
const EmojiButton = memo(({
                              emoji,
                              label,
                              isSelected,
                              onClick
                          }: {
    emoji: string;
    label: string;
    isSelected: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={`text-2xl p-2 rounded-full transition-all ${
            isSelected ? 'bg-purple-100 scale-110' : 'hover:bg-gray-100'
        }`}
        title={label.toLowerCase()}
        type="button"
    >
        {emoji}
    </button>
));

// Memoized Submit Section Component
const SubmitSection = memo(({
                                selectedEmoji,
                                setSelectedEmoji,
                                comment,
                                setComment,
                                isPublic,
                                setIsPublic,
                                handleSubmit,
                                isLoading
                            }: {
    selectedEmoji: FeedbackType | '';
    setSelectedEmoji: (emoji: FeedbackType | '') => void;
    comment: string;
    setComment: (comment: string) => void;
    isPublic: boolean;
    setIsPublic: (isPublic: boolean) => void;
    handleSubmit: () => Promise<void>;
    isLoading: boolean;
}) => (
    <div className="p-4 space-y-4">
        <div className="flex justify-center space-x-4">
            {Object.entries(FEEDBACK_TYPES).map(([key, value]) => (
                <EmojiButton
                    key={key}
                    emoji={EMOJIS[value]}
                    label={key}
                    isSelected={selectedEmoji === value}
                    onClick={() => setSelectedEmoji(value)}
                />
            ))}
        </div>

        <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="resize-none"
        />

        <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id="public-toggle"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="public-toggle" className="text-sm text-gray-600">
                Make feedback public
            </label>
        </div>

        <Button
            color="purple"
            className="w-full"
            onClick={handleSubmit}
            disabled={!selectedEmoji || isLoading}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2" />
                    Submitting...
                </div>
            ) : (
                'Submit Feedback'
            )}
        </Button>
    </div>
));

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ searchTerm, dataset }) => {
    // Auth hook
    const { isAuthenticated, user, socialLogin } = useAuth();

    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('submit');
    const [selectedEmoji, setSelectedEmoji] = useState<FeedbackType | ''>('');
    const [comment, setComment] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [stats, setStats] = useState<FeedbackStats>({
        agree: 0,
        disagree: 0,
        uncertain: 0,
        total: 0,
    });
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const popupRef = useRef<HTMLDivElement>(null);

    // Scroll visibility handler
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 100;
            setIsVisible(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Load data when popup opens
    useEffect(() => {
        console.log('isOpen', isOpen);
        if (isOpen) {
            loadData().then(r => r);
        }
    }, [isOpen]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Load feedback stats
            const statsResponse = await fetch(
                `${API_BASE_URL}/api/feedback/stats/?search=${encodeURIComponent(searchTerm)}&dataset=${encodeURIComponent(dataset)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            );

            // Load feedback history
            const feedbacksResponse = await fetch(
                `${API_BASE_URL}/api/feedback/list/?search=${encodeURIComponent(searchTerm)}&dataset=${encodeURIComponent(dataset)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            );

            if (!statsResponse.ok || !feedbacksResponse.ok) {
                throw new Error('Failed to load feedback data');
            }

            const statsData = await statsResponse.json();
            const feedbacksData = await feedbacksResponse.json();

            setStats(statsData);
            setFeedbacks(feedbacksData);
        } catch (err) {
            setError('Failed to load feedback data');
            console.error('Data loading failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = useCallback(async () => {
        if (!isAuthenticated || !selectedEmoji) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/feedback/submit/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    searchTerm,
                    dataset,
                    feedback: selectedEmoji,
                    comment,
                    isPublic
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            setComment('');
            setSelectedEmoji('');
            setIsPublic(true);
            setActiveTab('feedback');
        } catch (err) {
            setError('Failed to submit feedback');
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, selectedEmoji, searchTerm, dataset, comment, isPublic]);

    const handleVote = async (feedbackId: number, isUpvote: boolean) => {
        if (!isAuthenticated) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/feedback/vote/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    feedbackId,
                    isUpvote
                })
            });

            if (!response.ok) {
                throw new Error('Failed to register vote');
            }

            await loadData(); // Refresh feedback list
        } catch (err) {
            setError('Failed to register vote');
        }
    };

    const FeedbackList = () => (
        <div className="p-4 space-y-4">
            {/* Stats Section */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg">
                {Object.entries(stats).slice(0, -1).map(([key, value]) => (
                    <div key={key} className="text-center">
                        <div className="text-xl mb-1">{EMOJIS[key as keyof typeof EMOJIS]}</div>
                        <div className="text-sm font-medium text-gray-900">{value}</div>
                    </div>
                ))}
            </div>

            {/* Error Alert */}
            {error && (
                <Alert color="failure" onDismiss={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="text-center py-8">
                    <div className="loading-spinner mx-auto" />
                </div>
            ) : (
                <div className="space-y-3">
                    {feedbacks.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                            No feedback yet. Be the first to share your thoughts!
                        </div>
                    ) : (
                        feedbacks.map((feedback: Feedback) => (
                            <div key={feedback.id} className="feedback-item bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                {/* Feedback Header */}
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-2">
                                        {feedback.user.avatar ?
                                            <Avatar img={feedback.user.avatar} size="sm" bordered/>
                                            :
                                            <Avatar
                                                placeholderInitials=
                                                    {feedback.user.username ? feedback.user.username.charAt(0).toUpperCase() : 'R'}
                                                size="sm" bordered/>
                                        }
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {feedback.user.username ? feedback.user.username : feedback.user.email.split('@')[0].charAt(0).toUpperCase() + feedback.user.email.split('@')[0].slice(1)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(feedback.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xl" title={feedback.feedback}>
                    {EMOJIS[feedback.feedback]}
                  </span>
                                </div>

                                {/* Feedback Content */}
                                {feedback.comment && (
                                    <p className="text-sm text-gray-600 mt-2 break-words">
                                        {feedback.comment}
                                    </p>
                                )}

                                {/* Feedback Footer */}
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex space-x-4">
                                        <button
                                            className={`vote-button flex items-center space-x-1 transition-colors ${
                                                feedback.hasUserVoted?.upvoted
                                                    ? 'text-purple-600'
                                                    : 'text-gray-500 hover:text-purple-600'
                                            }`}
                                            onClick={() => handleVote(feedback.id, true)}
                                            disabled={!isAuthenticated || isLoading}
                                            title={isAuthenticated ? 'Upvote' : 'Login to vote'}
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                            <span className="text-xs">{feedback.upvotes}</span>
                                        </button>
                                        <button
                                            className={`vote-button flex items-center space-x-1 transition-colors ${
                                                feedback.hasUserVoted?.downvoted
                                                    ? 'text-purple-600'
                                                    : 'text-gray-500 hover:text-purple-600'
                                            }`}
                                            onClick={() => handleVote(feedback.id, false)}
                                            disabled={!isAuthenticated || isLoading}
                                            title={isAuthenticated ? 'Downvote' : 'Login to vote'}
                                        >
                                            <ThumbsDown className="w-4 h-4" />
                                            <span className="text-xs">{feedback.downvotes}</span>
                                        </button>
                                    </div>
                                    {feedback.isPublic && (
                                        <Badge color="purple" size="sm">Public</Badge>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Feedback Button */}
            <div
                className={`transition-all duration-300 transform ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
            >
                <Button
                    color="purple"
                    size="lg"
                    pill
                    onClick={() => setIsOpen(!isOpen)}
                    className="shadow-lg hover:shadow-xl group"
                >
                    <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Feedback
                </Button>
            </div>

            {/* Feedback Panel */}
            {isOpen && (
                <div
                    ref={popupRef}
                    className="feedback-popup absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl border"
                >
                    {/* Panel Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setActiveTab('submit')}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    activeTab === 'submit'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => setActiveTab('feedback')}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    activeTab === 'feedback'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Feedback
                            </button>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            aria-label="Close feedback panel"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Panel Content */}
                    <div className="max-h-[70vh] overflow-y-auto">
                        {activeTab === 'submit' ? (
                            !isAuthenticated ? (
                                <AuthSection />
                            ) : (
                                <SubmitSection
                                    selectedEmoji={selectedEmoji}
                                    setSelectedEmoji={setSelectedEmoji}
                                    comment={comment}
                                    setComment={setComment}
                                    isPublic={isPublic}
                                    setIsPublic={setIsPublic}
                                    handleSubmit={handleSubmit}
                                    isLoading={isLoading}
                                />
                            )
                        ) : (
                            <FeedbackList/>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(FeedbackSection);