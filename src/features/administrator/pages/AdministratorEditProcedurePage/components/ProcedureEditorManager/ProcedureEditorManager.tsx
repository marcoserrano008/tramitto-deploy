"use client"

import { useState } from "react"
import type { FileResponse, ProcedureTypeResponse, UpdateProcedureTypeRequest } from "../EditProcedureForm/EditProcedureForm.tsx"
import EditProcedureForm from "../EditProcedureForm/EditProcedureForm.tsx";
import ProceduresSelector from "../ProceduresSelector/ProceduresSelector.tsx";

interface ProcedureEditorManagerProps {
  procedures: ProcedureTypeResponse[]
  onUpdate: (procedureId: number, data: UpdateProcedureTypeRequest) => Promise<void>
  onUploadImage: (file: File) => Promise<FileResponse>
  onCancel?: () => void
}

type ViewMode = "selector" | "editor"

export default function ProcedureEditorManager({
                                                 procedures,
                                                 onUpdate,
                                                 onUploadImage,
                                                 onCancel,
                                               }: ProcedureEditorManagerProps) {
  const [currentView, setCurrentView] = useState<ViewMode>("selector")
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureTypeResponse | null>(null)

  const handleSelectProcedure = (procedure: ProcedureTypeResponse) => {
    setSelectedProcedure(procedure)
    setCurrentView("editor")
  }

  const handleBackToSelector = () => {
    setSelectedProcedure(null)
    setCurrentView("selector")
  }

  const handleUpdate = async (data: UpdateProcedureTypeRequest) => {
    if (!selectedProcedure) return
    await onUpdate(selectedProcedure.id, data)
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      handleBackToSelector()
    }
  }

  if (currentView === "selector") {
    return <ProceduresSelector procedures={procedures} onSelectProcedure={handleSelectProcedure} onCancel={onCancel} />
  }

  if (currentView === "editor" && selectedProcedure) {
    return (
      <EditProcedureForm
        procedure={selectedProcedure}
        onUpdate={handleUpdate}
        onUploadImage={onUploadImage}
        onBack={handleBackToSelector}
        onCancel={handleCancel}
      />
    )
  }

  return null
}
