import {Outlet, useLocation, useParams} from 'react-router-dom';
import {MenuItem} from "primereact/menuitem";
import {Steps} from "primereact/steps";
import styles from './ProcedureStepsLayout.module.scss';

const procedureSteps = [
  {path: '', name: 'Information'},
  {path: 'payment', name: 'Payment'},
  {path: 'upload-document', name: 'Upload Documents'},
];

function ProcedureStepsLayout() {
  const {procedureType} = useParams<{ procedureType: string }>();
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

  const items: MenuItem[] = procedureSteps
    .filter((step) => step.path !== '')
    .map((step) => ({
      label: step.name
    }));

  const stepsActiveIndex = currentStepIndex === 0 ? -1 : currentStepIndex - 1;

  return (
    <article className={styles.procedureStepsOutlet}>
      {/*<section className={styles.proceduresHeader}>*/}
      {/*  <span className={styles.proceduresHeaderTitle}>{procedureType}</span>*/}
      {/*  <section className={styles.proceduresHeaderLeft}>*/}
      {/*    <label><strong>Codigo de tramite: </strong> 123</label>*/}
      {/*    <label><strong>Fecha de inicio</strong>17 de mayo de 2025</label>*/}

      {/*  </section>*/}
      {/*  <section className={styles.proceduresHeaderRight}></section>*/}

      {/*</section>*/}
      {stepsActiveIndex > -1 && <Steps model={items} activeIndex={stepsActiveIndex}/>}
      <section className="outlet-container">
        <Outlet/>
      </section>
    </article>
  );
}

export default ProcedureStepsLayout;