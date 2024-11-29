import React from 'react';
import { Card} from 'flowbite-react';
import { HiExternalLink } from 'react-icons/hi';

interface GooglePage {
    url: string;
    html: string;
}

interface GoogleResultsSectionProps {
    pages: GooglePage[];
    selectedPage: GooglePage | null;
    setSelectedPage: (page: GooglePage | null) => void;
}

const GoogleResultsSection: React.FC<GoogleResultsSectionProps> = ({ pages,selectedPage, setSelectedPage }) => {
    return (
        <>
            <Card className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pages.slice(0, 4).map((page, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-3">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                  Source {idx + 1}
                </span>
                                <a
                                    href={page.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <HiExternalLink className="w-4 h-4" />
                                </a>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
                                {new URL(page.url).hostname}
                            </p>

                            <button
                                onClick={() => setSelectedPage(page)}
                                className="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                View Content
                            </button>
                        </div>
                    ))}
                </div>
            </Card>
        </>
    );
};

export default GoogleResultsSection;