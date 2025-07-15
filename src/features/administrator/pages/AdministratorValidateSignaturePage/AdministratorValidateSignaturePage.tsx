import SignatureValidator from "./components/SignatureValidator/SignatureValidator.tsx";

export default function AdministratorValidateSignaturePage() {
  const handleVerificationResult = (result: any) => {
    console.log("Verification result:", result)
  }

  return (
    <div>
      <SignatureValidator onVerify={handleVerificationResult} />
    </div>
  )
}
