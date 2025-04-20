import { useNavigate, useLocation, useParams } from 'react-router-dom';

function ApplicantStepPaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { procedureType } = useParams<{ procedureType: string }>(); // Get type from URL

  const paymentDetails = location.state?.paymentDetails;

  console.log('Payment Details Received:', paymentDetails);
  console.log('Procedure Type from URL:', procedureType);

  const handleConfirmPayment = () => {
    console.log('Payment confirmed (mocked).');

    const uploadTaskDetails = {
      paymentConfirmationId: `PAY-${Date.now()}`,
      requiredDocuments: ['Passport Scan', 'Proof of Address'],
      procedureType: procedureType,
    };

    navigate('../upload-document', { state: { uploadTaskDetails } });
  };

  return (
    <div>
      <h2>Step 1: Payment</h2>
      <p>Procedure Type: {procedureType}</p>
      {paymentDetails && (
        <p>
          Amount Due: {paymentDetails.amount} {paymentDetails.currency}
        </p>
      )}
      <p>Please complete the payment.</p>
      {/* Add payment form elements here */}
      <button onClick={handleConfirmPayment}>Confirm Payment (Mock)</button>
    </div>
  );
}

export default ApplicantStepPaymentPage;
