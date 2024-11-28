import {HiThumbDown, HiThumbUp, HiX} from "react-icons/hi";
import {Badge} from "flowbite-react";
import React from "react";

interface ModelResponseProps {
    model: string;
    response: {
        short_ans: number;
        full_ans: string;
    };
}
export const ModelResponse: React.FC<ModelResponseProps> = ({ model, response }) => {
    const getValue = () => {
        return response.short_ans;
    };

    const value = getValue();

    const getStatusConfig = () => {
        switch(value) {
            case 1:
                return {
                    icon: <HiThumbUp className="w-5 h-5 text-green-600" />,
                    bgColor: 'bg-green-100',
                    badge: { color: 'success', text: 'Verified' }
                };
            case 0:
                return {
                    icon: <HiThumbDown className="w-5 h-5 text-red-600" />,
                    bgColor: 'bg-red-100',
                    badge: { color: 'failure', text: 'Not Verified' }
                };
            default:
                return {
                    icon: <HiX className="w-5 h-5 text-gray-600" />,
                    bgColor: 'bg-gray-100',
                    badge: { color: 'gray', text: 'No Answer' }
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    {config.icon}
                </div>
                <div>
                    <h5 className="text-lg font-semibold text-gray-900">{model}</h5>
                    <Badge
                        color={config.badge.color}
                        className="mt-1"
                    >
                        {config.badge.text}
                    </Badge>
                </div>
            </div>

            <div className="text-sm">
                <div className="text-gray-600 mr-2">Reasoning:</div>
                <div className="max-w-md text-gray-800">{response.full_ans}</div>
            </div>

        </div>
    );
};
