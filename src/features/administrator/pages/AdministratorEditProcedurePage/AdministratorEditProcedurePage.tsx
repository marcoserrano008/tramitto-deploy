import ProcedureEditorManager from "./components/ProcedureEditorManager/ProcedureEditorManager.tsx";

const mockProcedures = [
  {
    id: 1,
    name: "Legalización de Diploma de Bachiller",
    description:
      "Proceso de legalización oficial de diplomas de bachiller emitidos por instituciones educativas reconocidas.",
    cost: "150.00",
    isActive: true,
    steps: [
      "Realizar el pago del trámite",
      "Subir documentos requeridos",
      "Verificación de documentos",
      "Proceso de legalización",
      "Entrega del documento legalizado",
    ],
    requirements: [
      "Cédula de Identidad vigente",
      "Diploma de Bachiller original",
      "Selfie para verificación de identidad",
      "Comprobante de pago",
    ],
    durationDays: 3,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
    imageId: "img_123456789",
  },
  {
    id: 2,
    name: "Legalización de Diploma Academico",
    description:
      "Proceso de legalización oficial de diplomas academicos.",
    cost: "150.00",
    isActive: true,
    steps: [
      "Realizar el pago del trámite",
      "Subir documentos requeridos",
      "Verificación de documentos",
      "Proceso de legalización",
      "Entrega del documento legalizado",
    ],
    requirements: [
      "Cédula de Identidad vigente",
      "Diploma de Bachiller original",
      "Selfie para verificación de identidad",
      "Comprobante de pago",
    ],
    durationDays: 3,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
    imageId: "img_123456789",
  },
  {
    id: 3,
    name: "Legalización de Titulo en provision nacional",
    description:
      "Proceso de legalización oficial de diplomas de Titulo en provision nacional.",
    cost: "150.00",
    isActive: true,
    steps: [
      "Realizar el pago del trámite",
      "Subir documentos requeridos",
      "Verificación de documentos",
      "Proceso de legalización",
      "Entrega del documento legalizado",
    ],
    requirements: [
      "Cédula de Identidad vigente",
      "Diploma de Bachiller original",
      "Selfie para verificación de identidad",
      "Comprobante de pago",
    ],
    durationDays: 3,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
    imageId: "img_123456789",
  },
]

export default function AdministratorEditProcedurePage() {
  const handleUpdate = async (procedureId: number, data: any) => {
    console.log(`Updating procedure ${procedureId}:`, data)

    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Procedure updated successfully!")
        alert(`¡Procedimiento ${procedureId} actualizado exitosamente!`)
        resolve()
      }, 2000)
    })
  }

  const handleUploadImage = async (file: File) => {
    console.log("Uploading image:", file.name)

    // Simulate image upload
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          id: `img_${Date.now()}`,
          filename: file.name,
          fileDownloadUri: `https://example.com/files/${file.name}`,
          fileType: file.type,
          size: file.size,
        }
        console.log("Image uploaded:", mockResponse)
        resolve(mockResponse)
      }, 1500)
    })
  }

  const handleCancel = () => {
    console.log("Operation cancelled")
    // Navigate back or close modal
  }

  return (
    <ProcedureEditorManager
      procedures={mockProcedures}
      onUpdate={handleUpdate}
      onUploadImage={handleUploadImage}
      onCancel={handleCancel}
    />
  )
}
