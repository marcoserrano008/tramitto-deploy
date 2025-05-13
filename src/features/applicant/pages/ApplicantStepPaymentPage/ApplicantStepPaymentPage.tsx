import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {useProcedurePayment} from "../../hooks/useProcedurePayment.ts";
import {useEffect} from "react";
import {PaymentDetails} from "../../../../types/PaymentDetails.interface.ts";

function ApplicantStepPaymentPage() {
  const {procedureType} = useParams<{ procedureType: string }>(); // Get type from URL
  const location = useLocation();
  const navigate = useNavigate();

  const paymentDetails: PaymentDetails = location.state?.paymentDetails || {
    amount: 0,
    currency: 'BOB',
    procedureType: procedureType || '',
    procedureName: '',
    procedureId: 0
  };

  console.log('payment details', paymentDetails);

  const {
    createdProcedure,
    creationLoading,
    creationError,
    paymentProcessing,
    paymentSuccess,
    paymentError,
    paymentResponse,
    handlePayment
  } = useProcedurePayment(paymentDetails);

  useEffect(() => {
    if (paymentSuccess && paymentResponse) {
      const timer = setTimeout(() => {
        navigate('../upload-document', {
          state: {
            procedureData: paymentResponse
          }
        });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, paymentResponse, navigate]);

  if (creationLoading) {
    return <div>Creating your procedure...</div>;
  }

  if (creationError) {
    return <div className="error-message">{creationError}</div>;
  }

  return (
    <div className="payment-page">
      <h1>Payment Information</h1>

      <div className="procedure-details">
        <p><strong>Procedure:</strong> {paymentDetails.procedureName}</p>
        <p><strong>Amount to pay:</strong> {paymentDetails.amount} {paymentDetails.currency}</p>
        {createdProcedure && (
          <p><strong>Procedure ID:</strong> {createdProcedure.id}</p>
        )}
      </div>

      <div className="payment-method">
        <h2>Payment Method</h2>
        <div className="payment-options">
          <div className="payment-option active">
            <input
              type="radio"
              id="qr"
              name="payment-method"
              value="qr"
              checked
              readOnly
            />
            <label htmlFor="qr">QR Code Payment</label>
          </div>
        </div>

        {/* Mock QR Code */}
        <div className="qr-container">
          <div className="mock-qr">
            <p>Scan to pay {paymentDetails.amount} {paymentDetails.currency}</p>
            <div className="qr-code">
              <div style={{
                width: '200px',
                height: '200px',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                QR Code Placeholder
              </div>
            </div>
          </div>
        </div>

        {/* Simulate Payment Button */}
        <button
          className="payment-button"
          onClick={handlePayment}
          disabled={paymentProcessing || paymentSuccess}
        >
          {paymentProcessing ? 'Processing...' : paymentSuccess ? 'Payment Successful' : 'Simulate Payment'}
        </button>

        {paymentError && <div className="payment-error">{paymentError}</div>}
        {paymentSuccess && (
          <div className="payment-success">
            Payment successful! Transaction ID: {paymentResponse?.payment?.transactionId}
            <p>Redirecting to document upload...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicantStepPaymentPage;
