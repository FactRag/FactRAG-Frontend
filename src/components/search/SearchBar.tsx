// src/components/search/SearchBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput } from 'flowbite-react';
import { Triple } from '../../types';
import {yagoData} from "../../data/yago";

interface SearchMatch {
    text: string;
    dataset: string;
    identifier: string;
    triple: Triple;
}

const realData: Record<string, Record<string, Triple>> = {
    "yago": yagoData
}

export const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [matches, setMatches] = useState<SearchMatch[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<SearchMatch | null>(null);
    const navigate = useNavigate();
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const searchTriples = (term: string): SearchMatch[] => {
        const results: SearchMatch[] = [];
        const searchTerm = term.toLowerCase();

        Object.entries(realData).forEach(([dataset, identifiers]) => {
            Object.entries(identifiers).forEach(([identifier, triple]) => {
                const tripleString = `${triple.subject} ${triple.predicate} ${triple.object}`.toLowerCase();
                if (tripleString.includes(searchTerm)) {
                    results.push({
                        text: `${triple.subject} ${triple.predicate} ${triple.object}`,
                        dataset,
                        identifier,
                        triple
                    });
                }
            });
        });

        return results;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedMatch) {
            navigate(`/results?search=${selectedMatch.identifier}&dataset=${selectedMatch.dataset}`);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="flex items-center max-w-4xl mx-auto" autoComplete="off">
                <TextInput
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setMatches(searchTriples(e.target.value));
                        setShowSuggestions(true);
                        setSelectedMatch(null);
                    }}
                    placeholder="Search for a fact to verify..."
                    className="w-full"
                />
                <button
                    type="submit"
                    id="verify-button"
                    className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                    <span className="sr-only">Search</span>
                </button>
            </form>

            {showSuggestions && matches.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-50 overflow-y-auto max-h-96"
                >
                    {matches.map((match, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setQuery(match.text);
                                setSelectedMatch(match);
                                setShowSuggestions(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                        >
                            <div className="flex justify-between items-center gap-2">
                                <span className="text-gray-900 truncate">{match.text}</span>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-400">
                                        {match.dataset}
                                    </span>
                                    <span className="text-xs text-gray-400 min-w-[5ch] text-right whitespace-pre">
                                        {match.identifier.length > 5 ? match.identifier.slice(0, 5) : match.identifier.padEnd(5, '')}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

};