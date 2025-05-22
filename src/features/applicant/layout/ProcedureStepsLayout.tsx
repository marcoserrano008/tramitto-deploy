import {Outlet} from 'react-router-dom';
import styles from './ProcedureStepsLayout.module.scss';

function ProcedureStepsLayout() {
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