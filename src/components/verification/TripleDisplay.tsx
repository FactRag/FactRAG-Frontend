// components/verification/TripleDisplay.tsx
import React from 'react';
import {Card, Badge} from 'flowbite-react';
import {HiCube, HiLink} from 'react-icons/hi';

interface TripleDisplayProps {
    subject: string;
    predicate: string;
    object: string;
}

export const TripleDisplay: React.FC<TripleDisplayProps> = (
    {
        subject,
        predicate,
        object
    }
) => {
    const EntityBox: React.FC<{
        type: 'subject' | 'predicate' | 'object';
        value: string;
    }> = ({type, value}) => {
        const isPredicateBox = type === 'predicate';
        return (
            <div className={`${isPredicateBox ? 'bg-blue-50' : 'bg-gray-50'} rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-2">
                    <Badge
                        color={isPredicateBox ? 'blue' : 'gray'}
                        className="px-3 py-1"
                    >
                        <div className="flex items-center gap-1">
                            {isPredicateBox ? (
                                <HiLink className="w-4 h-4"/>
                            ) : (
                                <HiCube className="w-4 h-4"/>
                            )}
                            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        </div>
                    </Badge>
                    <HiLink className="w-4 h-4 text-gray-400"/>
                </div>
                <p className={`${isPredicateBox ? 'text-blue-900' : 'text-gray-900'} font-medium break-words`}>
                    {value}
                </p>
            </div>
        );
    };

    return (
        <Card className="mb-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EntityBox type="subject" value={subject}/>
                <EntityBox type="predicate" value={predicate}/>
                <EntityBox type="object" value={object}/>
            </div>
        </Card>
    );
};