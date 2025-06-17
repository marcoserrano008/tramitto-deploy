import ProcedureEditorManager from "./components/ProcedureEditorManager/ProcedureEditorManager.tsx";
import {useEffect, useState} from "react";
import {ProcedureTypeResponse} from "../../../../types/ProcedureTypeResponse.interface.ts";
import {procedureTypesService} from "../../../../services/ProcedureTypes.http.service.ts";
import {FileResponse} from "../../../../types/FileResponse.interface.ts";
import {uploadFileService} from "../../../../services/UploadFile.http.service.ts";
import {useNavigate} from "react-router-dom";
import {useToast} from "../../../../context/ToastContext.tsx";

export default function AdministratorEditProcedurePage() {
  const {showSuccess} = useToast();
  const [procedures, setProcedures] = useState<ProcedureTypeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const procedures: ProcedureTypeResponse[] = await procedureTypesService.getAllProcedures();
        procedures.sort((a, b) => a.id - b.id);
        setProcedures(procedures);

      } catch (err) {
        console.error('Failed to load procedure types', err);
        setError(`${err}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUpdate = async (procedureId: number, data: Partial<ProcedureTypeResponse>) => {
    try {
      const updated = await procedureTypesService.updateProcedure(procedureId, data,);
      setProcedures((prev) => prev.map((p) => (p.id === updated.id ? updated : p)),);
      showSuccess('Procedimiento', 'Actualizado correctamente');
    } catch (err) {
      console.error('Error updating procedure', err);
      alert('No se pudo actualizar el procedimiento. Intenta de nuevo.');
    }
  };

  const handleUploadImage = async (file: File, description?: string): Promise<FileResponse | void> => {
    try {
      const fileUploaded: FileResponse = await uploadFileService.upload(file, description);
      return fileUploaded;
    } catch (err) {
      console.error('Error uploading image', err);
      alert('No se pudo subir la imagen. Intenta de nuevo.');
    }
  };

  const handleCancel = () => {
    navigate('/');
  }

  if (loading) return <p>Cargando procedimientos…</p>;
  if (error) return <p>Error cargando datos. Inténtalo de nuevo.</p>;

  return (
    <ProcedureEditorManager
      procedures={procedures}
      onUpdate={handleUpdate}
      onUploadImage={handleUploadImage}
      onCancel={handleCancel}
    />
  )
}
