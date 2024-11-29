import { useCallback, useEffect, useState } from 'react'

export const useDocumentContent = () => {
  const [docModal, setDocModal] = useState({
    isOpen: false,
    fileId: '',
    content: '',
    isLoading: false
  })

  const loadContent = useCallback(async (fileId: string) => {
    setDocModal(prev => ({ ...prev, isLoading: true }))
    try {
      const response = await fetch(`/data/txt/${fileId}`)
      if (!response.ok) throw new Error('Failed to load document')
      const content = await response.text()
      setDocModal(prev => ({
        ...prev,
        content,
        isLoading: false
      }))
    } catch (error) {
      console.error('Error loading document:', error)
      setDocModal(prev => ({
        ...prev,
        content: '',
        isLoading: false,
        isOpen: false,
        fileId: ''
      }))
    }
  }, [])

  useEffect(() => {
    if (docModal.fileId) {
      loadContent(docModal.fileId)
    }
  }, [docModal.fileId, loadContent])

  const openDocument = useCallback((fileId: string) => {
    setDocModal({
      isOpen: true,
      fileId,
      content: '',
      isLoading: true
    })
  }, [])

  const closeDocument = useCallback(() => {
    setDocModal({
      isOpen: false,
      fileId: '',
      content: '',
      isLoading: false
    })
  }, [])

  return {
    docModal,
    openDocument,
    closeDocument
  }
}