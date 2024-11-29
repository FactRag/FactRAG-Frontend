// components/verification/modals/DocumentModal.tsx
import React from 'react';
import { Modal } from 'flowbite-react';

interface DocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileId: string;
    content: string;
    isLoading: boolean;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
                                                                isOpen,
                                                                onClose,
                                                                fileId,
                                                                content,
                                                                isLoading
                                                            }) => {
    const getFileName = (fileId: string) => fileId.split('/').pop() || fileId;

    return (
        <Modal
            show={isOpen}
    onClose={onClose}
    size="4xl"
    theme={{
        content: {
            base: "relative h-[80vh] w-full rounded-lg bg-white shadow flex flex-col"
        }
    }}
>
    <Modal.Header>
        <div className="text-lg font-semibold text-gray-900 truncate">
        {fileId && getFileName(fileId)}
    </div>
    </Modal.Header>

    <Modal.Body className="p-4 flex-grow overflow-hidden relative">
        {isLoading ? (
                <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
            ) : (
                <div className="h-full overflow-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-lg">
                    {content}
                    </pre>
                    </div>
            )}
        </Modal.Body>
        </Modal>
);
};
