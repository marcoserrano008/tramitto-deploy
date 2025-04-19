import {useParams} from "react-router-dom";

function ApplicantProcedureInformationPage() {

  const {procedureType} = useParams<{procedureType: string}>();

  return (
    <div>
      ApplicantProcedureInformationPage
      <h1>{procedureType}</h1>
    </div>
  );
}

export default ApplicantProcedureInformationPage;
