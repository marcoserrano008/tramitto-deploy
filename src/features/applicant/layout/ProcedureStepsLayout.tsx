import {Outlet, useLocation} from 'react-router-dom';
import {MenuItem} from "primereact/menuitem";
import {Steps} from "primereact/steps";
import styles from './ProcedureStepsLayout.module.scss';
import {procedureSteps} from "../../../types/procedureSteps.ts";

function ProcedureStepsLayout() {
  const location = useLocation();

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPathEnd = pathSegments[pathSegments.length - 1];

  const currentStepIndex = procedureSteps.findIndex((step: {path: string, name: string}) => step.path === currentPathEnd);

  const items: MenuItem[] = procedureSteps.filter((step) => step.path !== '')
    .map((step) => ({label: step.name}));

  const stepsActiveIndex = currentStepIndex === 0 ? -1 : currentStepIndex - 1;

  return (
    <article className={styles.procedureStepsOutlet}>
      {/*{stepsActiveIndex > -1 && <Steps model={items} activeIndex={stepsActiveIndex}/>}*/}
      <section className="outlet-container">
        <Outlet/>
      </section>
    </article>
  );
}

export default ProcedureStepsLayout;