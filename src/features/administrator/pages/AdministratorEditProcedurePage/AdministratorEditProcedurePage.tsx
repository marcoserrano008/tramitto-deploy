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
    name: "Certificado de Antecedentes Penales",
    description: "Emisión de certificado que acredita la ausencia de antecedentes penales del solicitante.",
    cost: "75.00",
    isActive: true,
    steps: [
      "Completar formulario de solicitud",
      "Realizar el pago correspondiente",
      "Verificación de identidad",
      "Procesamiento de la solicitud",
      "Emisión del certificado",
    ],
    requirements: ["Cédula de Identidad vigente", "Formulario de solicitud completo", "Comprobante de pago"],
    durationDays: 5,
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-18T16:30:00Z",
    imageId: "img_987654321",
  },
  {
    id: 3,
    name: "Registro de Marca Comercial",
    description: "Proceso para el registro oficial de marcas comerciales ante las autoridades competentes.",
    cost: "500.00",
    isActive: false,
    steps: [
      "Búsqueda de antecedentes marcarios",
      "Presentación de documentación",
      "Pago de tasas correspondientes",
      "Examen de forma y fondo",
      "Publicación en gaceta oficial",
      "Emisión del certificado de registro",
    ],
    requirements: [
      "Solicitud de registro de marca",
      "Comprobante de pago de tasas",
      "Poder notarial (si aplica)",
      "Logotipo de la marca en formato digital",
      "Descripción de productos o servicios",
    ],
    durationDays: 90,
    createdAt: "2024-01-05T14:20:00Z",
    updatedAt: "2024-01-25T11:45:00Z",
    imageId: "img_555666777",
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
