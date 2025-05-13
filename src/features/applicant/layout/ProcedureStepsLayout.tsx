import { Outlet, useLocation, useParams } from 'react-router-dom';

const procedureSteps = [
  { path: '', name: 'Information' },
  { path: 'payment', name: 'Payment' },
  { path: 'upload-document', name: 'Upload Documents' },
];

function ProcedureStepsLayout() {
  const { procedureType } = useParams<{ procedureType: string }>();
  const location = useLocation();

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPathEnd = pathSegments[pathSegments.length - 1];

  let currentStepIndex = procedureSteps.findIndex(
    (step) => step.path === currentPathEnd
  );

  if (currentStepIndex === -1 && currentPathEnd === procedureType) {
    currentStepIndex = procedureSteps.findIndex((step) => step.path === '');
  }

  if (currentStepIndex === -1) {
    console.warn("Could not determine current step for path:", location.pathname);
    currentStepIndex = 0;
  }

  return (
    <article className="outlet-container">
      <section className="outlet-container">
        <Outlet />
      </section>
    </article>
  );
}

export default ProcedureStepsLayout;


// return (
//   <div>
//     {/* Optional: Add a heading or context */}
//     <span>{procedureType} Procedure</span>
//
//     {/* === Placeholder for your Steps Component === */}
//     <div style={{ margin: '20px 0', padding: '10px', border: '1px dashed blue' }}>
//       <p>Future Steps Component Area:</p>
//       {/*
//             When you build StepsComponent, you'll pass props like:
//             <StepsComponent
//                 steps={procedureSteps}
//                 currentStepIndex={currentStepIndex}
//                 totalSteps={procedureSteps.length}
//             />
//          */}
//       <p>(Current Step Index: {currentStepIndex} - {procedureSteps[currentStepIndex]?.name})</p>
//     </div>
//     {/* ========================================== */}
//
//     {/* This Outlet renders the actual page component for the current step */}
//     {/* (ApplicantProcedureInformationPage, ApplicantStepPaymentPage, or ApplicantStepUploadDocumentPage) */}
//     <main>
//       <Outlet />
//     </main>
//
//     {/* Optional: Add common footer elements for the steps if needed */}
//   </div>
// );