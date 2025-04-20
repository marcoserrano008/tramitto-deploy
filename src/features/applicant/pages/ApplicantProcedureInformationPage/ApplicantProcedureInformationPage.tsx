import { useParams, useNavigate } from 'react-router-dom';

function ApplicantProcedureInformationPage() {
  const { procedureType } = useParams<{ procedureType: string }>();
  const navigate = useNavigate();

  const handleStartProcedure = () => {
    const paymentDetails = {
      amount: 100, // Example amount
      currency: 'BOB',
      procedureType: procedureType,
    };

    navigate('payment', { state: { paymentDetails } });
  };

  return (
    <div>
      <h2>Procedure Information</h2>
      <h1>{procedureType}</h1>
      <p>Details about the {procedureType} procedure go here.</p>
      <button onClick={handleStartProcedure}>Start Procedure (Go to Payment)</button>
    </div>
  );
}

export default ApplicantProcedureInformationPage;
