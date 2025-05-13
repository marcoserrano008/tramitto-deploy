import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {useEffect, useRef, useState} from "react";
import {FileResponse} from "../../../../types/FileResponse.interface.ts";
import {DocumentTypeEnum} from "../../../../types/enum/DocumentType.enum.ts";
import axios from "axios";
import {ProcedureResponse} from "../../../../types/ProcedureResponse.interface.ts";
import {ProcedureStatusEnum} from "../../../../types/enum/ProcedureStatus.enum.ts";

function ApplicantStepUploadDocumentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {procedureType} = useParams<{ procedureType: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get procedure data from previous step
  const procedureData: ProcedureResponse = location.state?.procedureData;

  // States for file handling
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<DocumentTypeEnum>(DocumentTypeEnum.PROCEDURE_DOCUMENT);

  // States for processing
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');

  // Validate that we have procedure data
  useEffect(() => {
    if (!procedureData) {
      setError('Missing procedure data. Unable to continue.');
    }
  }, [procedureData]);

  // Generate preview when file is selected
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    // Create preview URL for the selected file
    const fileUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(fileUrl);

    // Clean up the URL when component unmounts or file changes
    return () => {
      URL.revokeObjectURL(fileUrl);
    };
  }, [selectedFile]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setError(null);
    }
  };

  // Process document upload, attachment and submission
  const handleProcessDocument = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    if (!procedureData) {
      setError('Missing procedure data. Please return and try again.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Upload the document
      setCurrentStep('Uploading document...');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('description', `Document for procedure: ${procedureData.id}`);

      const uploadResponse = await axios.post<FileResponse>(
        'http://localhost:3000/api/v1/document/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Step 2: Attach document to procedure
      setCurrentStep('Attaching document to procedure...');
      await axios.post(
        'http://localhost:3000/api/v1/procedures/documents/attach',
        {
          procedureId: procedureData.id,
          documentType: documentType,
          documentId: uploadResponse.data.id
        }
      );

      if (procedureData.status == ProcedureStatusEnum.REJECTED) {
        setCurrentStep('Submitting procedure for review...');
        await axios.post(
          'http://localhost:3000/api/v1/procedures/re-submit',
          {procedureId: procedureData.id}
        );
      } else {
        // Step 3: Submit procedure for review
        setCurrentStep('Submitting procedure for review...');
        await axios.post(
          'http://localhost:3000/api/v1/procedures/submit-for-review',
          {procedureId: procedureData.id}
        );
      }

      // Success - redirect to personal procedures
      setCurrentStep('Complete! Redirecting...');
      setTimeout(() => {
        navigate('/applicant/personal-procedures');
      }, 1000);

    } catch (error) {
      console.error('Error processing document:', error);
      setError(`Failed during step: ${currentStep}. Please try again.`);
      setIsProcessing(false);
    }
  };

  if (error && !procedureData) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate('/applicant/personal-procedures')}
          className="btn-primary"
        >
          Return to My Procedures
        </button>
      </div>
    );
  }

  return (
    <div className="document-upload-container">
      <h2>Document Upload</h2>

      {procedureData && (
        <div className="procedure-info">
          <p><strong>Procedure:</strong> {procedureData.procedureTypeName}</p>
          <p><strong>ID:</strong> {procedureData.id}</p>
          <p><strong>Status:</strong> {procedureData.status}</p>
        </div>
      )}

      <div className="upload-section">
        <h3>Upload Required Document</h3>

        <div className="file-input-container">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isProcessing}
            accept=".pdf,.jpg,.jpeg,.png"
            style={{display: 'none'}}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="btn-secondary"
          >
            {selectedFile ? 'Change File' : 'Select File'}
          </button>

          {selectedFile && (
            <span className="selected-file">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </span>
          )}
        </div>

        {/* Preview section appears immediately after file selection */}
        {previewUrl && selectedFile && (
          <div className="document-preview">
            <h4>Document Preview</h4>
            {selectedFile.type.startsWith('image/') ? (
              <img
                src={previewUrl}
                alt="Document preview"
                style={{maxWidth: '100%', maxHeight: '300px'}}
              />
            ) : selectedFile.type === 'application/pdf' ? (
              <iframe
                src={previewUrl}
                width="300px"
                height="400px"
                title="PDF Preview"
              />
            ) : (
              <p>
                Preview not available for this file type.
              </p>
            )}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {/* Single button to process everything */}
        <button
          onClick={handleProcessDocument}
          disabled={!selectedFile || isProcessing}
          className="btn-primary btn-large"
        >
          {isProcessing ? currentStep : 'Process Document'}
        </button>

        {isProcessing && (
          <div className="progress-indicator">
            <div className="spinner"></div>
            <p>{currentStep}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicantStepUploadDocumentPage;