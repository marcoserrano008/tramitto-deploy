import {ProcedureResponse} from "../../../../types/ProcedureResponse.interface.ts";
import {useLocation, useParams} from "react-router-dom";
import {useState} from "react";
import {urlToProcedureEnum} from "../../../../types/urlToProcedureEnum.ts";
import {useProcedureTypeData} from "../../hooks/useProcedureTypeData.ts";
import {ProcedureTypeEnum} from "../../../../types/enum/ProcedureType.enum.ts";
import ApplicantStepSearchDocumentPage from "../ApplicantStepSearchDocumentPage/ApplicantStepSearchDocumentPage.tsx";
import ApplicantStepUploadDocumentPage from "../ApplicantStepUploadDocumentPage/ApplicantStepUploadDocumentPage.tsx";

type LocationState = { procedureData?: ProcedureResponse };

export default function ApplicantStepSubmitDocumentPage() {
  const {procedureType} = useParams<{ procedureType: string }>();
  const location = useLocation();
  const procedureData = (location.state as LocationState | null)?.procedureData;

  const procedureTypeEnum: ProcedureTypeEnum | undefined = procedureType ? urlToProcedureEnum[procedureType] : undefined;

  const {procedure, error} = useProcedureTypeData(procedureTypeEnum as ProcedureTypeEnum);
  console.log(procedure)

  const [mode, setMode] = useState<"search" | "upload">("search");

  if (error) return <div>Error: {String(error)}</div>;
  if (!procedure || !procedureData)
    return <div>Faltan datos del trámite.</div>;

  return mode === "search" ? (
    <ApplicantStepSearchDocumentPage
      procedure={procedure}
      procedureData={procedureData}
      onManualUpload={() => setMode("upload")}
    />
  ) : (
    <ApplicantStepUploadDocumentPage
      procedure={procedure}
      procedureData={procedureData}
      onBackToSearch={() => setMode("search")}
    />
  );
}