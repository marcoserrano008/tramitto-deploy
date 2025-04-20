import { useNavigate, useLocation, useParams } from 'react-router-dom';

function ApplicantStepUploadDocumentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { procedureType } = useParams<{ procedureType: string }>(); // Get type from URL

  const uploadTaskDetails = location.state?.uploadTaskDetails;

  console.log('Upload Task Details Received:', uploadTaskDetails);
  console.log('Procedure Type from URL:', procedureType);

  const handleUploadComplete = () => {
    console.log('Documents uploaded (mocked).');
    navigate('/applicant/personal-procedures');
  };

  return (
    <div>
      <h2>Step 2: Upload Documents</h2>
      <p>Procedure Type: {procedureType}</p>
      {uploadTaskDetails && (
        <div>
          <p>Payment Confirmation ID: {uploadTaskDetails.paymentConfirmationId}</p>
          <p>
            Required Documents:{' '}
            {uploadTaskDetails.requiredDocuments.join(', ')}
          </p>
        </div>
      )}
      <p>Please upload the required documents.</p>
      <button onClick={handleUploadComplete}>Finish Upload (Mock)</button>
    </div>
  );
}

export default ApplicantStepUploadDocumentPage;
