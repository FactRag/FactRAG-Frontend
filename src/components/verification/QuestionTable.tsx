// components/verification/QuestionTable.tsx
import React, { useMemo } from 'react';
import type { Question } from '../../types/verification';

interface QuestionTableProps {
    questions: Question[];
}

export const QuestionTable: React.FC<QuestionTableProps> = ({ questions }) => {
    const sortedQuestions = useMemo(() =>
            [...questions].sort((a, b) => Number(b.score) - Number(a.score)),
        [questions]
    );

    const getScoreColor = (score: number) => {
        if (Number(score) >= 0.8) return 'text-green-600';
        if (Number(score) >= 0.6) return 'text-blue-600';
        if (Number(score) >= 0.4) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getRankBadge = (idx: number) => {
        if (idx >= 3) return null;

        const badges = [
            { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Best Match' },
            { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Second Best' },
            { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Third Best' }
        ];

        const badge = badges[idx];
        return (
            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
        );
    };

    return (
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
                            {idx < 3 ? (
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full 
                    ${idx === 0 ? 'bg-yellow-100 text-yellow-800' :
                                    idx === 1 ? 'bg-gray-100 text-gray-800' :
                                        'bg-amber-100 text-amber-800'}`}>
                    {idx + 1}
                  </span>
                            ) : (
                                <span className="text-gray-500">{idx + 1}</span>
                            )}
                        </td>
                        <td className="px-4 py-3">
                            <div className="flex items-center">
                                <span className="font-medium text-gray-900">{q.question}</span>
                                {getRankBadge(idx)}
                            </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono">
                <span className={`${idx < 3 ? 'font-bold' : ''} ${getScoreColor(q.score)}`}>
                  {Number(q.score).toFixed(4)}
                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};