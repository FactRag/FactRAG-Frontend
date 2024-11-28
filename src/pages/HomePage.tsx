// src/pages/HomePage.tsx
import React from 'react';
import { SearchBar } from '../components/search/SearchBar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import {Badge} from "flowbite-react";

const modelBadges = [
    { name: 'Gemma2', color: 'yellow' },
    { name: 'Llama3.1', color: 'indigo' },
    { name: 'Mistral', color: 'purple' },
    { name: 'Qwen2.5', color: 'pink' }
];

const techBadges = [
    { name: 'Knowledge Graph', color: 'blue' },
    { name: 'Fact Verification', color: 'gray' },
    { name: 'Retrieval-Augmented Generation', color: 'red' },
    { name: 'Large Language Models', color: 'green' }
];

export const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto mb-8">
                    <img
                        src="/images/comics.png"
                        alt="Knowledge Graph Verification"
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>

                <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {[...techBadges, ...modelBadges].map((badge) => (
                            <Badge
                                key={badge.name}
                                color={badge.color}
                                className={`border border-${badge.color}-400`}
                            > {badge.name}</Badge>
                        ))}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto mb-8">
                    <p className="text-gray-700 text-center text-sm md:text-base leading-relaxed">
                        A novel approach to <span className="font-semibold text-gray-900 underline decoration-blue-500 decoration-double">knowledge graph fact verification</span> using
                        <span className="font-semibold text-gray-900 underline decoration-green-500 decoration-dotted">Retrieval-Augmented Generation (RAG)</span>,
                        and multiple
                        <span className="font-semibold text-gray-900 underline decoration-green-500 decoration-dotted">Large Language Models (LLMs)</span>.
                        The system verifies the truthfulness of facts within knowledge graphs by combining advanced
                        information retrieval techniques with an ensemble of language models.
                    </p>
                    <p className="text-gray-700 text-center text-sm md:text-base leading-relaxed">
                        Enter a fact in the search bar below to verify its truthfulness.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto relative">
                    <SearchBar />
                </div>
            </main>

            <Footer />
        </div>
    );
};