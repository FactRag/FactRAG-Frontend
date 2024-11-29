import React from 'react';
import { Card } from 'flowbite-react';

interface EmojiStatsProps {
    stats: {
        agree: number;
        disagree: number;
        uncertain: number;
    };
}

const CircularProgress: React.FC<{
    percentage: number;
    color: string;
    size?: string;
}> = ({ percentage, color, size = "h-10 w-10" }) => (
    <div className={`${size} relative`}>
        <svg className="w-full h-full" viewBox="0 0 36 36">
            {/* Background circle */}
            <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-current text-gray-100"
                strokeWidth="3"
            />
            {/* Progress circle */}
            <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className={`stroke-current ${color}`}
                strokeWidth="3"
                strokeDasharray={`${percentage} 100`}
                strokeDashoffset="0"
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
            />
        </svg>
    </div>
);

const EmojiStats: React.FC<EmojiStatsProps> = ({ stats }) => {
    const total = stats.agree + stats.disagree + stats.uncertain;

    const statItems = [
        {
            emoji: '👍',
            label: 'Positive',
            count: stats.agree,
            color: 'text-green-400',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            emoji: '😐',
            label: 'Uncertain',
            count: stats.uncertain,
            color: 'text-gray-400',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200'
        },
        {
            emoji: '👎',
            label: 'Negative',
            count: stats.disagree,
            color: 'text-red-400',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
        }
    ];

    return (
        <Card className="w-full">
            <div className="flex justify-between items-center gap-4">
                {statItems.map((item, index) => (
                    <div
                        key={index}
                        className={`flex-1 ${item.bgColor} rounded-lg p-4 border ${item.borderColor} text-center`}
                    >
                        <div className="flex flex-col items-center">
                            {/* Emoji Circle */}
                            <div className={`mb-2 text-2xl ${item.color}`}>
                                <span role="img" aria-label={item.label}>{item.emoji}</span>
                            </div>

                            {/* Circular Progress */}
                            <div className="relative">
                                <CircularProgress
                                    percentage={total > 0 ? (item.count / total) * 100 : 0}
                                    color={item.color}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className={`text-xl font-bold ${item.color}`}>
                                            {item.count}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Label */}
                            <div className="mt-2">
                                <h4 className="text-sm font-medium text-gray-700">
                                    {item.label}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    {total > 0 ? Math.round((item.count / total) * 100) : 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total Section */}
            <div className="mt-4 pt-3 border-t text-center">
        <span className="text-sm text-gray-500">
          Total Responses: <span className="font-medium">{total}</span>
        </span>
            </div>
        </Card>
    );
};


export default EmojiStats;