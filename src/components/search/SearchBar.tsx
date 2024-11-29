import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput } from 'flowbite-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useSearchData } from '../../hooks/useSearchData';
import SearchSuggestion from './SearchSuggestion';
import type { SearchMatch } from '../../types/search';

export const SearchBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<SearchMatch | null>(null);
    const navigate = useNavigate();
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const matches = useSearchData(query);

    useOnClickOutside(suggestionsRef, () => setShowSuggestions(false));

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (selectedMatch) {
            navigate(`/results?search=${selectedMatch.identifier}&dataset=${selectedMatch.dataset}`);
        }
    }, [navigate, selectedMatch]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setShowSuggestions(true);
        setSelectedMatch(null);
    }, []);

    const handleMatchSelect = useCallback((match: SearchMatch) => {
        setQuery(match.text);
        setSelectedMatch(match);
        setShowSuggestions(false);
    }, []);

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="flex items-center max-w-4xl mx-auto" autoComplete="off">
                <TextInput
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search for a fact to verify..."
                    className="w-full"
                    data-testid="search-input"
                />
                <button
                    type="submit"
                    className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedMatch}
                    data-testid="search-submit"
                >
                    <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                    <span className="sr-only">Search</span>
                </button>
            </form>

            {showSuggestions && matches.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-50 overflow-y-auto max-h-96"
                    data-testid="suggestions-container"
                >
                    {matches.map((match, index) => (
                        <SearchSuggestion
                            key={`${match.dataset}-${match.identifier}-${index}`}
                            match={match}
                            onSelect={handleMatchSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};