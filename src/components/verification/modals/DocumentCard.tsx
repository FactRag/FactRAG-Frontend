import React from "react";
import {SelectedDoc} from "../../../types/verification";
import {HiEye, HiOutlineDocumentText} from "react-icons/hi";

export const DocumentCard: React.FC<{
    doc: SelectedDoc;
    index: number;
    onView: () => void;
}> = ({ doc, index, onView }) => {
    const getFileName = (fileId: string) => {
        return fileId.split('/').pop() || fileId;
    };

    return (
        <div
            className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all p-4 flex flex-col items-center cursor-pointer"
            onClick={onView}
        >
            <div className="text-blue-600 mb-2">
                <HiOutlineDocumentText className="w-8 h-8"/>
            </div>

            <p className="text-xs text-gray-500 text-center mb-2">
                Document {index + 1}
            </p>

            <p className="text-sm text-gray-900 font-medium mb-3 text-center truncate w-full">
                {getFileName(doc.file_id)}
            </p>

            <button
                className="flex items-center justify-center text-xs text-blue-600 hover:text-blue-800 transition-colors">
                <HiEye className="w-4 h-4 mr-1"/>
                View Content
            </button>
        </div>
    );
}